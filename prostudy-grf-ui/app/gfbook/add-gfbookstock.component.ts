import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { RouteData } from '../route-data.provider';
import { GFBookStockService, GFBook, GFBookStock } from './gfbook.service';

@Component({
    moduleId: module.id,
    selector: 'proerp-add-gfbookstock',
    templateUrl: './add-gfbookstock.component.html',
    styleUrls: ['./feature.component.css']
})

export class AddGfbookStockComponent {

    tempBookStocks: GFBook[];
    private instituteID: number;
    book: GFBook = new GFBook();
    bookQty:number;
    bookstock: GFBookStock = new GFBookStock();
    newBookStockList: Array<GFBookStock> = [];
    feedStockDate: Date = new Date();


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private gfbookservice: GFBookStockService
    ) {
        this.instituteID = +this.bookstock.instituteID;
        this.getGFBookByInstituteId();
        this.newBookStockList.push(this.getTempBookStock());
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        this.getGFBookByInstituteId();
    }

    getTempBookStock() {
        return {
            book: new GFBook(),
            bookQty: 0,
            feedStockDate: new Date(),
            instituteID: '5910974510923776'
        };
    }

    addNewEntry() {
        this.newBookStockList.push(this.getTempBookStock());
    }

    addGFbookStock() {
        this.bookstock.instituteID = '5910974510923776';
        this.bookstock.feedStockDate = this.feedStockDate;
        this.bookstock.book = this.book;
        this.bookstock.bookQty = +this.bookQty;
        this.newBookStockList.splice(0,this.newBookStockList.length);
        this.newBookStockList.push(this.bookstock);
        this.gfbookservice.addGFBookStock(this.bookstock);
    }

    getGFBookByInstituteId(): void {
        console.log('Came to ListGfBookComponent:getGFBookByInstituteId');
        this.gfbookservice.getGFBookByInstituteId(this.instituteID).then(list => {
            this.tempBookStocks=list;
        });
    }
}