import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from "@angular/router";
import { AppState } from '../../app.service';

@Component({
  selector: 'home',
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public name: string;

  constructor(public appState: AppState, private router: Router) {
    this.name = sessionStorage.getItem("authorize");
  }

  public ngOnInit() {
    
    let loginIsTrue = sessionStorage.getItem("authorize");
    if (!loginIsTrue) {
      this.router.navigate(['/']);
    }

  }

  public logout() {
    sessionStorage.removeItem("authorize");
    this.router.navigate(['/']);
  }

  
}
