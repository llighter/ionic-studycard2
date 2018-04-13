import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login/login";

import * as firebase from 'firebase/app';
import { AuthServiceProvider } from "../providers/auth-service/auth-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform
              , statusBar: StatusBar
              , splashScreen: SplashScreen
              , private _auth: AuthServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    // If user are logged in, Move to HomePage else LoginPage
    this._auth.user.subscribe((user: firebase.User) => {
      if(user) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
    })

  }
}
