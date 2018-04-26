import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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

@IonicPage()
@Component({
  selector: 'page-card-detail',
  templateUrl: 'card-detail.html',
})
export class CardDetailPage implements OnInit {

  categoryName: string;
  currentCard: Observable<Card>;
  private currentStageSubject$: BehaviorSubject<number>;
  private categoryDoc: AngularFirestoreDocument<Card>;
  private cardsCollection: AngularFirestoreCollection<Card>;

  constructor(public navCtrl: NavController
    , public navParams: NavParams
    , private _auth: AuthServiceProvider
    , public alertCtrl: AlertController
    , private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    // console.log(`[card-detail]${JSON.stringify(this.navParams)}`);
    this.categoryName = this.navParams.get('categoryName');
    this.currentStageSubject$ = new BehaviorSubject(0);

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
            ).valueChanges()
        )

      }
    })
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
      question: data.question,
      answer: data.answer,
      source: data.source,
      repetition: 0,
      stage: 0,
      modifiedDate: new Date()
    }

    this.cardsCollection.doc(id).set(card).then(() => {
      console.log(`[+] New card inserted to Firestore..`);
    })
  }

  filterByStage(stage: number) {
    this.currentStageSubject$.next(stage);
    console.log(`[Current-Stage]${this.currentStageSubject$.getValue()}`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardDetailPage');
  }

}
