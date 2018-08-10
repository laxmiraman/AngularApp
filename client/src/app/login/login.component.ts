import { Component, OnInit, Pipe, ViewContainerRef } from '@angular/core';
import { Login, LoginService } from './Login-service';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { ToastsManager, ToastOptions, Toast } from 'ng2-toastr/ng2-toastr';
import { AppService } from '../core/app-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})

export class LoginComponent implements OnInit {
  private authenticate: Login[] = [];
  private username: string;
  private password: string;
  private luserName = [];
  private lrole = [];
  private errorMessage: string;
  private busy: Subscription;
  private subscription: Subscription;
  private response: string[] = [];
  private options: ToastOptions = new ToastOptions();
  

  constructor(public toastr: ToastsManager, vcr: ViewContainerRef,  private LoginService: LoginService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.options.positionClass = 'toast-bottom-left';
     
   }


  getAuthenticate(){
    console.log("Inside the getAuthenticate");
    this.LoginService.getAuthenticate(this.username,this.password)
      .subscribe(
      login => this.authenticate = login,
       error => {this.errorMessage = <any>error;  },
      () => this.onAuthenticateSuccess1()
      );
  }

   SaveToLacalStorage(authenticate){
    localStorage.setItem('currentUser', JSON.stringify({ authenticate }));
    //localStorage.setItem('currentUser', authenticate);
  }

 onAuthenticateSuccess1(){
     this.luserName = this.authenticate.map(function (data) {
       console.log("&&&&&&&&"+data.UserName);
      return data.UserName;
    });  
    
    console.log("$$$$$$$$$$$$$"+this.luserName);
      this.lrole = this.authenticate.map(function (data) {
      return  data.RoleName;
      });     
      if(this.luserName.length>0 && this.lrole.length >0){
        this.showSuccess();
  //    this.toastr.info('Congrats, You are authenticated !!');
       }else{
       this.showError();
    //  this.toastr.error('You are not Authorized, please contact the administrator'); 
   } 
         this.SaveToLacalStorage(this.authenticate); }

     showSuccess() {
      this.toastr.success('Congrats, You are authenticated !!');  }
     
     showError() {
     this.toastr.container = null;
     this.toastr.error('Bad Request', 'You are not Authorized, please contact the administrator');
  }

}

