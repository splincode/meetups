// angular
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

// libs
import { ConfigService } from '@ngx-config/core';
import { MetaService } from '@ngx-meta/core';
// import { I18NRouterService } from '@ngx-i18n-router/core';
import { TranslateService } from '@ngx-translate/core';

// external styles
import '../assets/sass/layout.scss';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	
	ngOnInit() {

	}

}
