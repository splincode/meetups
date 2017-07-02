import { AuthComponent } from './components/auth/auth.component';

// angular
import { Routes } from '@angular/router';

// libs
import { MetaGuard } from '@ngx-meta/core';


export const routes: Routes = [
  { path: '', component: AuthComponent},
  { path: 'home', loadChildren: "./modules/home/home.module#HomeModule"},

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
