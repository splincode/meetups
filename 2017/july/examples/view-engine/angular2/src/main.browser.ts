import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

export function main(): Promise<any> {
  return platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(err));
}


switch (document.readyState) {
  case 'loading':
    document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
    break;
  case 'interactive':
  case 'complete':
  default:
    main();
}

function _domReadyHandler() {
 document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
 main();
}
