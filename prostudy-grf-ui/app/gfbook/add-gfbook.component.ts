import {Component, Optional, OnInit, AfterContentInit, ContentChild,
  AfterViewChecked, AfterViewInit, ViewChild, ViewChildren} from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { RouteData } from '../route-data.provider';
import { GFBookStockService, GFBook } from './gfbook.service';


@Component({
  moduleId: module.id,
  selector: 'proerp-add-gfbook',
  templateUrl: './add-gfbook.component.html',
  styleUrls: ['./feature.component.css']
})

export class AddGfbookComponent implements OnInit {
  
  @ViewChildren('bookName') vc: any;

  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }

  id: string;
  book: GFBook;
  standardList: string[];
  medium: string[];
  date:Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routeData: RouteData,
    private gfbookservice: GFBookStockService
  ) {
    this.book = new GFBook();
    this.standardList = ["5th", "6th", "7th", "8th", "9th", "10th",
      "11th", "12th", "FY", "SY", "TY", "Fr. Y", "PG/D. & B. Ed-1", "PG/D. & B. Ed-2", "Teacher"];
    this.medium = ["Marathi", "Hindi", "English", "Kannada"];
  }

  ngOnInit() {
    if (this.routeData.params.selectedBook) {
            this.book = this.routeData.params.selectedBook;
            console.log('this.user.id: ' + this.book.id);
            // Clean the data from routeData 
            this.routeData.params.selectedBook = null;
        }
  }

  addbook() {
    this.book.instituteID = '5910974510923776';
    this.book.bookFeedDate = this.date;
    this.gfbookservice.addbook(this.book);
  }
}