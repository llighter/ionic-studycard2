import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from "../pages/login/login";
import { StatsPage } from '../pages/stats/stats';
import { environment } from "../environments/environment";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { CardDetailPage } from '../pages/card-detail/card-detail';

import { GooglePlus } from '@ionic-native/google-plus';


@NgModule({
  declarations: [
    MyApp,
    StatsPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    CardDetailPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    StatsPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    CardDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    GooglePlus
  ]
})
export class AppModule {}
