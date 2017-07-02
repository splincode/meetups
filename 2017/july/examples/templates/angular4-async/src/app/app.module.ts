import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppState } from './app.service';
import { RouterModule, PreloadAllModules } from '@angular/router';

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],

  providers: [
    AppState
  ]
})
export class AppModule {

}
