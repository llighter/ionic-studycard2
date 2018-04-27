import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore"
import { Observable } from "rxjs/Observable";

import * as firebase from 'firebase/app';
import 'rxjs/add/operator/switchMap';
import { User } from '../../domain/user';
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from 'ionic-angular';


/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  user: Observable<User>;
  constructor(private afAuth: AngularFireAuth
    , private afs: AngularFirestore
    , private gplus: GooglePlus
    , private platform: Platform) {
      
    // TODO: firestore를 사용하는데 계속적으로 써야한다면 auth-service같이 firestore를 분리해야하지 않을까?
    const firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true };
    firestore.settings(settings);

    // Get auth data, then get firestore user document || null
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
        } else {
          return Observable.of(null)
        }
      })
  }

  // googleLogin() {
  //   const provider = new firebase.auth.GoogleAuthProvider()
  //   return this.oAuthLogin(provider);
  // }

  // private oAuthLogin(provider) {
  //   return this.afAuth.auth.signInWithPopup(provider)
  //     .then((credential) => {
  //       this.updateUserData(credential.user)
  //     })
  // }

  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    }

    return userRef.set(data, { merge: true })
  }

  async nativeGoogleLogin(): Promise<void> {
    try {
      const gplusUser = await this.gplus.login({
        'webClientId': '549242650630-r48mvl89ddfd2ir6vvrlgaabahmbpb6m.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })

      return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
    } catch (err) {
      console.log(err)
    }
  }

  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();

      await this.afAuth.auth.signInWithPopup(provider)
        .then((credential) => {
          this.updateUserData(credential.user)
        });
    } catch (err) {
      console.log(err)
    }
  }

  googleLogin() {
    if (this.platform.is('cordova')) {
      this.nativeGoogleLogin();
    } else {
      this.webGoogleLogin();
    }
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      // TODO: Move to login page(Maybe doesn't neccesary..)
    })
  }

}
