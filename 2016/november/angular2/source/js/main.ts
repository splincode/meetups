import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MessageBoxModule } from './components/message-box/message-box.module';

// $(document).ready();
platformBrowserDynamic().bootstrapModule(MessageBoxModule);