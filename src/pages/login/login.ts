import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController
              , public navParams: NavParams
              , private _auth: AuthServiceProvider) {
  }

  signIn() {
    // TODO: 로그인이 되어있지 않은 경우와 그렇지 않은 경우 구분하기
    this._auth.googleLogin();
  }

  signOut() {
    this._auth.signOut();
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
