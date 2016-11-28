import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MessageBoxComponent } from './message-box.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [MessageBoxComponent],
  bootstrap: [ MessageBoxComponent ]
})
export class MessageBoxModule {};