import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from "@angular/router";


@Component({
  selector: 'auth',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["auth.component.scss"],
  templateUrl: "auth.component.html"
})
export class AuthComponent implements OnInit {

  public status: string;
  public isFail: boolean;
  public name: string;
  public password: string;

  constructor(private router: Router) {}

  public ngOnInit() {
    
    if (readCookie("ngsession") === 'auth') {
      this.router.navigate(['home']);
    }

  }

  public login(login: string = '', password: string = '') {
  
    if (login == "admin" && password == "admin") {

      createCookie("ngsession", "auth", 1);
      this.router.navigate(['home']);

    } else if (!(login && password)) {
     
      this.status = "empty";
    
    } else {

      this.status = "fail";
      
    }


  }

}


// TODO: заменить на правильную реализацию с cookie cервисами

function createCookie(name: any,value: any,days: any) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name: any) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name: any) {
    createCookie(name,"",-1);
}