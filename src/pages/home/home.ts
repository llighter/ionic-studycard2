import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import * as firebase from 'firebase/app';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Category } from '../../domain/category';
import { Observable } from 'rxjs/Observable'
import { CardDetailPage } from '../card-detail/card-detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  pushPage: any;

  // TODO: 인터페이스로 선언한 유저 데이터를 받아오려면 인터페이스를 분리해서
  // 서비스로부터 정보를 받아와야 하는가?
  private userName: string; 
  private categoriesCollection: AngularFirestoreCollection<Category>;
  categories: Observable<Category[]>


  constructor(public navCtrl: NavController
              , private _auth: AuthServiceProvider
              , private afs: AngularFirestore
              , public alertCtrl: AlertController) {  
  }

  ngOnInit(): void {
    this.pushPage = CardDetailPage;

    this._auth.user.subscribe((user: firebase.User) => {
      
      if(user) {
        this.userName = user.displayName;
        this.categoriesCollection = this.afs.collection<Category>(`users/${user.uid}/categories`);
        // .valueChanges() is simple. It just returns the 
        // JSON data without metadata. If you need the 
        // doc.id() in the value you must persist it your self
        // or use .snapshotChanges() instead. See the addItem()
        // method below for how to persist the id with
        // valueChanges()
        this.categories = this.categoriesCollection.valueChanges();
        
        
      } else {
        this.userName = `Not logged in`;
      }
      // this.userName = user ? user.displayName : `Not logged in`;

    })
  }

  addCategory():void {
    let prompt = this.alertCtrl.create({
      title: 'New Category',
      message: "Enter a name for this new category you're so want to make",
      inputs: [
        {
          name: 'categoryName',
          placeholder: 'Category Name'
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
            const id = this.afs.createId();
            const category: Category = { 
              categoryId: id,
              categoryName: data.categoryName,
              createdDate: new Date()
            };

            this.categoriesCollection.doc(id).set(category);
            console.log(`Saved clicked: ${JSON.stringify(category)}`);
          }
        }
      ]
    });
    prompt.present();
  }

  deleteCategory(id: string): void {
    this.categoriesCollection.doc(id).delete();
  }

  signOut() {
    this._auth.signOut();
  }


}
