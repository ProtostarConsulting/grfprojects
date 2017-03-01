import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { RouteData } from '../route-data.provider';
import { GFBookStockService, GFBookTransaction, GFBook } from './gfbook.service';

@Component({
    moduleId: module.id,
    selector: 'proerp-list-gfbookstocktransaction',
    templateUrl: 'list-gfbookStocktransaction.component.html',
    styleUrls: ['./feature.component.css']
})

export class ListGfBookStockTransactionComponent {

    bookStocks: GFBookTransaction[];
    instituteID: number;
    book: GFBook = new GFBook();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private gfbookService: GFBookStockService) {
        this.bookStocks = new Array<GFBookTransaction>();
        console.log('came to contructor...');
        this.instituteID = +this.book.instituteID;
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        this.getGFBookStockTransactionByInstituteId();
    }

    getGFBookStockTransactionByInstituteId(): void {
        console.log('Came to ListGfBookComponent:getGFBookStockTransactionByInstituteId');
        this.gfbookService.getGFBookStockTransactionByInstituteId(this.instituteID).then(list => {
            this.bookStocks = list;
            console.log('Came to ListGfBookComponent:bookList:' + this.bookStocks);
        });
    }

}