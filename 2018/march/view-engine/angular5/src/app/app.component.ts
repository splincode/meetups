import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

@Component({
  selector: "app-root",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./app.component.css"],
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {

  constructor(public appState: AppState) {}

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}