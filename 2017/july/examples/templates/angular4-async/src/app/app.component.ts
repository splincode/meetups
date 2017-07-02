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