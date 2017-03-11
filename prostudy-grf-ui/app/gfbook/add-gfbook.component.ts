import {
  Component, Optional, OnInit, AfterContentInit, ContentChild,
  AfterViewChecked, AfterViewInit, ViewChild, ViewChildren
} from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { RouteData } from '../route-data.provider';
import { GFBookStockService, GFBook } from './gfbook.service';
import { standardList, answerOfMediumList } from '../core/constant.app';


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

  book: GFBook;
  standardList: string[];
  medium: string[];
  date: Date = new Date();
  currentBook: GFBook;
  bookID: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routeData: RouteData,
    private gfbookservice: GFBookStockService
  ) {
    this.book = new GFBook();
    this.standardList = standardList;
    this.medium = answerOfMediumList;
  }

  ngOnInit() {
    if (this.routeData.params.selectedBook) {
      this.bookID = this.routeData.params.selectedBook;
      this.getGFBookById(this.bookID);
      console.log('this.book.id: ' + this.book.id);
      // Clean the data from routeData 
      this.routeData.params.selectedBook = null;
    }
  }

  addbook() {
    this.book.instituteID = '5910974510923776';
    this.book.bookFeedDate = this.date;
    this.gfbookservice.addbook(this.book);
    this.gfbookservice.addbook(this.book).then(bookObj => {
      console.log('Saved currentBook:' + bookObj);
      this.currentBook = bookObj;
      this.addTranAfterAddBook();

    });
  }

  getGFBookById(id: string) {
    this.gfbookservice.getGFBookById(id).then(tempbook => {
      this.book = tempbook;
    });
  }

  addTranAfterAddBook() {
    this.gfbookservice.addTranAfterAddBook(this.currentBook);
  }

  gotolist(){
     this.router.navigate(['/gfbook-index/listgfbook']);
  }
}