import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from '../compiled/src/app/app.module.ngfactory';

export function main(): Promise<any> {
  return platformBrowser()
    .bootstrapModuleFactory(AppModuleNgFactory)
    .catch((err) => console.error(err));
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