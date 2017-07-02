import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'home',
  styleUrls: [ './home.component.scss' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public name: string;

  constructor(private router: Router) {}

  public ngOnInit() {

    if (readCookie("ngsession") !== "auth") {
      this.router.navigate(['/']);
    }

  }

  public logout() {
    eraseCookie("ngsession");
    this.router.navigate(['/']);
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