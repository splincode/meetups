import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HomeModule } from './modules/home/home.module';

import { SharedModule } from './shared/shared.module';
import { AuthComponent } from './components/auth/auth.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, XLargeDirective } from './app.component';


@NgModule({
  declarations: [ AppComponent, XLargeDirective, AuthComponent ],
  imports: [
    SharedModule,
    HomeModule,
    AppRoutingModule
  ]
})
export class AppModule {
}

export { AppComponent } from './app.component';
