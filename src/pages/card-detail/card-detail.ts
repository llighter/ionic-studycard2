import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as firebase from 'firebase/app';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
/**
 * Generated class for the CardDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-card-detail',
  templateUrl: 'card-detail.html',
})
export class CardDetailPage implements OnInit {

  categoryName: string;
  show: boolean = true;
  stageCount: number[] = [0, 0, 0, 0, 0, 0];
  currentCard: Observable<Card[]>;
  public currentStageSubject$: BehaviorSubject<number>;
  private categoryDoc: AngularFirestoreDocument<Card>;
  private cardsCollection: AngularFirestoreCollection<Card>;

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , private _auth: AuthServiceProvider
    , public alertCtrl: AlertController
    , private afs: AngularFirestore) {

    // TODO: firestore를 사용하는데 계속적으로 써야한다면 auth-service같이 firestore를 분리해야하지 않을까?
    const firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true };
    firestore.settings(settings);
  }

  ngOnInit(): void {
    this.categoryName = this.navParams.get('categoryName');
    this.currentStageSubject$ = new BehaviorSubject(1);

    this._auth.user.subscribe((user: firebase.User) => {
      if (user) {
        // this.cardsCollection = this.afs.collection<Card>(`users/${user.uid}/categories/${this.navParams.get('categoryId')}/cardDeck`);
        this.categoryDoc = this.afs.collection<Card>('users')
          .doc(user.uid)
          .collection('categories')
          .doc(this.navParams.get('categoryId'));

        this.cardsCollection = this.categoryDoc
          .collection('cardDeck');

        // this.currentCard = this.categoryDoc
        //   .collection('cardDeck', ref =>
        //     ref.where("stage", "==", this.currentStageSubject$.getValue())
        //       .orderBy("modifiedDate", "asc")
        //       .limit(1)
        //   ).valueChanges();

        // TODO: switchMap이 중요하다. 위와 같이 switchMap이 없으면 stage 상태가 변해도 반응이 없다.
        this.currentCard = this.currentStageSubject$.switchMap(stage =>
          this.categoryDoc
            .collection('cardDeck', ref =>
              ref.where("stage", "==", this.currentStageSubject$.getValue())
                .orderBy("modifiedDate", "asc")
                .limit(1)
            ).valueChanges() as Observable<any[]>
        )

        this.updateStageCount();

        // TODO: 값이 변할 때마다 호출하도록 했더니 의도치 않게 중복으로 실행되는 경우가 생긴다.
        // this.cardsCollection.valueChanges().subscribe(data => {
        //   this.updateStageCount();
        // })
      }
    })
  }

  updateStageCount(): void {
    console.log(`[*] Updating stageCount array...`);
    this.stageCount.forEach((stage, index) => {
      this.cardsCollection.ref.where("stage", "==", index).get().then(querySnapshot => {
        console.log(`index:${index}---querysnapshot.size:${querySnapshot.size}`);
        this.stageCount[index] = querySnapshot.size;
      })
    });
  }

  addCard(): void {
    let prompt = this.alertCtrl.create({
      title: 'New Card',
      message: "Enter a name for this new category you're so want to make",
      inputs: [
        {
          name: 'question',
          placeholder: 'question'
        },
        {
          name: 'answer',
          placeholder: 'answer'
        },
        {
          name: 'source',
          placeholder: 'source'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.insertCard(data);
            // console.log(`${JSON.stringify(data)}`);
            console.log('Saved clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  insertCard(data: any) {
    const id = this.afs.createId();
    const card: Card = {
      cardID: id,
      question: data.question,
      answer: data.answer,
      source: data.source,
      repetition: 0,
      stage: 0,
      createdDate: new Date(),
      modifiedDate: new Date()
    }

    this.cardsCollection.doc(id).set(card).then(() => {
      console.log(`[+] New card inserted to Firestore..`);
      this.updateStageCount();
    })
  }

  filterByStage(stage: number) {
    this.currentStageSubject$.next(stage);
    console.log(`[*] Current stage is ${this.currentStageSubject$.getValue()}`);
  }

  isStageFull(level): boolean {
    let isFull: boolean = false;

    switch (level) {
      case 1:
        isFull = this.stageCount[0] == 30 ? true : false;
        break;
      case 2:
        isFull = this.stageCount[1] == 30 * 2 ? true : false;
        break;
      case 3:
        isFull = this.stageCount[2] == 30 * 5 ? true : false;
        break;
      case 4:
        isFull = this.stageCount[3] == 30 * 8 ? true : false;
        break;
      case 5:
        isFull = this.stageCount[4] == 30 * 15 ? true : false;
        break;
    }

    return isFull;
  }

  success(card: Card) {
    // console.log(`Congress! You're successed: ${JSON.stringify(card)}`);
    if (card.stage >= 1 && card.stage < 5) {
      if (!this.isStageFull(card.stage + 1)) {

        // TODO: 나중에 delete 부분과 겹치는 부분은 통합해야한다.
        card.stage++;
        card.repetition++;
        card.modifiedDate = new Date();

        this.cardsCollection.doc(card.cardID).update(card).then(() => {
          console.log(`[>>] Current card is updated to next stage :-D`);
          this.updateStageCount();
        })

      } else {
        let alert = this.alertCtrl.create({
          title: 'Second Stage is now Full!',
          subTitle: `Can't insert card into stage2.. It is now Full...`,
          buttons: ['OK']
        });
        alert.present();
      }
    }
    // TODO: (개선)카드 앞면으로 초기화
    this.show = true;
  }

  fail(card: Card) {
    // console.log(`Sorry! You're failed: ${JSON.stringify(card)}`);
    // card.failCount++;

    if (this.isStageFull(1) && card.stage != 1) {
      let alert = this.alertCtrl.create({
        title: 'First Stage is now Full!',
        subTitle: `Can't move card into stage1.. Need to Clear your stage1...`,
        buttons: ['OK']
      });
      alert.present();
    } else {
      card.stage = 1;
      // TODO: 나중에 success 부분과 겹치는 부분은 통합해야한다.
      card.repetition++;
      card.modifiedDate = new Date();

      this.cardsCollection.doc(card.cardID).update(card).then(() => {
        console.log(`[<<] Current card is updated to first stage :-)`);
        this.updateStageCount();
      })
    }

    // TODO: (개선)카드 앞면으로 초기화
    this.show = true;
  }

  drop(card: Card) {
    this.cardsCollection.doc(card.cardID).delete().then(() => {
      console.log(`[-] Current card is deleted from the card deck :-(`);
      this.updateStageCount();
    })

    // TODO: (개선)카드 앞면으로 초기화
    this.show = true;
  }

  edit(card: Card) {
    // this.cardsCollection.doc(card.cardID).delete().then(() => {
    //   console.log(`[-] Current card is deleted from the card deck :-(`);
    //   this.updateStageCount();
    // })

    // // TODO: (개선)카드 앞면으로 초기화
    // this.show = true;
  }

  importFromReservedStage(): void {
    let alert = this.alertCtrl.create({
      title: '# of card is too low',
      message: `Do you want to fill cards from reserved stage?
        (R's stage count: ${this.stageCount[0]})`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            console.log('OK clicked');
            this.fillByReservedStage();
          }
        }
      ]
    });
    alert.present();
  }

  fillByReservedStage(): void {
    let remainArea = 30 - this.stageCount[1];
    let numOfReservedCards = this.stageCount[0];
    let numOfCardToRefill: number = 0;
    let card: Card;

    numOfCardToRefill = (remainArea >= numOfReservedCards)
      ? numOfReservedCards
      : remainArea;
    console.log(`[numofCardToRefil]${numOfCardToRefill}`);

    this.cardsCollection.ref
      .where("stage", "==", 0)
      .limit(numOfCardToRefill)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          // TODO: 이렇게 cast 하는거 맞나?
          card = documentSnapshot.data() as Card;
          card.stage = 1;
          card.modifiedDate = new Date();

          this.cardsCollection.doc(card.cardID).update(card);
          this.updateStageCount();
        })
      })

    // for(let i = 0; i < numOfCardToRefill; i++) {
    //   this.reservedStageValues[i].stage = 1;

    //   // TODO: 2개 이상 충전하면 다 날아간다.
    //   this.queryObservable.remove(this.reservedStageKeys[i]);
    //   this.queryObservable.push(this.reservedStageValues[i]);
    // }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardDetailPage');
  }

}
