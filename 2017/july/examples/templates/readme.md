## if - else


```html

<ng-template #preload>
  <p>Идет загрузка данных...</p>
</ng-template>

<div *ngIf="data.length; else preload">
  <p *ngFor="let item of data"> {{item }} </p>
</div>


```


## switch

```html

<div [ngSwitch]="date.getDay">
    <ng-template [ngSwitchCase]="0">
        <div>Воскресенье</div>
    </ng-template>
    <ng-template [ngSwitchCase]="1">
        <div>Понедельник</div>
    </ng-template>
    <ng-template [ngSwitchCase]="2">
        <div>Вторник</div>
    </ng-template>
    <ng-template [ngSwitchCase]="3">
        <div>Среда</div>
    </ng-template>
    ...
</div>

```


## Классический пример получения данных с сервера




```javascript

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

interface Company {
  id: number;
  age: number;
  balance: string;
  picture: string;
  company:string;
}

@Component({
  selector: "app",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./app.component.css"],
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {

  public companies: Company[];
  private companyUrl: string = "http://beta.json-generator.com/api/json/get/EyveMvfNQ";

  constructor(private http: Http) {}

  public ngOnInit() {
    this.getCompanies().subscribe(companies => this.companies = companies);
  }

  getCompanies(): Observable<Company[]> {
    return this.http.get(this.companyUrl).map(res => res.json());
  }

}

```


```html

<div class="container">
	<div id="contact">
		
		<div *ngFor="let company of companies">
			<p><b>Имя компании: {{company.company}}</b></p>
			<p><b>Возраст: {{company.age}}</b></p>
			<p><b>Баланс: {{company.balance}}</b></p>
			<hr>
		</div>

	</div>
</div>

```



## Async




```javascript

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

interface Company {
  id: number;
  age: number;
  balance: string;
  picture: string;
  company:string;
}

@Component({
  selector: "app",
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./app.component.css"],
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {

  public companiesObservable: Observable<Company[]>;
  private companyUrl: string = "http://beta.json-generator.com/api/json/get/EyveMvfNQ";

  constructor(private http: Http) {}

  public ngOnInit() {
    this.companiesObservable = this.getCompanies();
  }

  getCompanies(): Observable<Company[]> {
    return this.http.get(this.companyUrl).map(res => res.json());
  }

}

```


```html

<div class="container">
	<div id="contact">

		<ng-template #loadingCompanies>
			<p>Идет загрузка данных...</p>
		</ng-template>

		<div *ngIf="companiesObservable | async as companies else loadingCompanies">
			
			<div *ngFor="let company of companies">
				<p><b>Имя компании: {{company.company}}</b></p>
				<p><b>Возраст: {{company.age}}</b></p>
				<p><b>Баланс: {{company.balance}}</b></p>
				<hr>
			</div>

		</div>

	</div>
</div>
```