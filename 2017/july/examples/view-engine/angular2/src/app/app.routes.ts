import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NoContentComponent } from './components/no-content/no-content.component';
import { AuthComponent } from "./components/auth/auth.component";

export const ROUTES: Routes = [
  { path: '',      component: AuthComponent },
  { path: 'home',  component: HomeComponent },
  { path: '**',    component: NoContentComponent },
];
