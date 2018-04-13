import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  // TODO: 인터페이스로 선언한 유저 데이터를 받아오려면 인터페이스를 분리해서
  // 서비스로부터 정보를 받아와야 하는가?
  private userName: string;  

  constructor(public navCtrl: NavController,
              private _auth: AuthServiceProvider) {
  }

  ngOnInit(): void {
    this._auth.user.subscribe((user: firebase.User) => {
      // TODO: app.compoenet.ts 에서 이미 인증 했는지 정보를 확인 했기 때문에 여기서는
      // 따로 확인을 안해도 되는 것인가? -> 로그아웃 시 null 에러 메시지 확인
      this.userName = user ? user.displayName : `Not logged in`;
    })
  }

  signOut() {
    this._auth.signOut();
  }


}
