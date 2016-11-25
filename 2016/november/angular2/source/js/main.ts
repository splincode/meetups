import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './components/app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);