import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthComponent } from "./components/auth/auth.component";


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: AuthComponent }
    ])
  ],
})
export class AppRoutingModule { }
