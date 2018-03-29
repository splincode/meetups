import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Router } from "@angular/router";
import { AppState } from '../../app.service';


@Component({
  selector: 'auth',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["auth.component.css"],
  templateUrl: "auth.component.html"
})
export class AuthComponent implements OnInit {

  public isEmpty: boolean;
  public name: string;
  public password: string;

  constructor(public appState: AppState, private router: Router) {}

  public ngOnInit() {
    
    let loginIsTrue = sessionStorage.getItem("authorize");
    if (loginIsTrue) {
      this.router.navigate(['home']);
    }

  }

  public login(login: string = '', password: string = '') {
  
    if (login.trim() && password.trim()) {

      sessionStorage.setItem("authorize", login);

      this.appState.set("login", login);
      this.router.navigate(['home']);
    
    } else {
     
      this.isEmpty = true;
    
    }

  }

}