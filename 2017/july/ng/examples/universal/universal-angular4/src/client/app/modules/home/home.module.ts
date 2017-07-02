import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  FormsModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [
    HomeRoutingModule,
    ...MODULES
  ],
  exports: [
  	...MODULES
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }
