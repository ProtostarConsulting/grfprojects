import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { RouteData } from '../route-data.provider';
import { GFBookStockService, GFBook } from './gfbook.service';

@Component({
    moduleId: module.id,
    selector: 'proerp-list-gfbook',
    templateUrl: 'list-gfbook.component.html',
    styleUrls: ['./feature.component.css']
})

export class ListGfBookComponent {

    bookList: GFBook[];
    private instituteID: number;
    book: GFBook = new GFBook();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private gfbookService: GFBookStockService) {
        this.bookList = new Array<GFBook>();
        console.log('came to contructor...');
        this.instituteID = +this.book.instituteID;
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        let noOfTries = 5;
        (function waitTillLoadingEP(me): void {
            if (me.gfbookService.isLoadingEP() && --noOfTries) {
                console.log('Waiting for Loading EP...every 2 seconds...?');
                setTimeout(function () { waitTillLoadingEP(me) }, 2000);
            } else {
                console.log('Loading EP done!');
                me.getGFBookByInstituteId();
            }
        })(this);
    }

    goToGfbook(selectedBook: GFBook) {
        this.routeData.params = { 'selectedBook': selectedBook };
        this.router.navigate(['/gfbook-index/addgfbook']);
    }

    getGFBookByInstituteId():void{
        console.log('Came to ListGfBookComponent:getGFBookByInstituteId');
        this.gfbookService.getGFBookByInstituteId(this.instituteID).then(list => {
            this.bookList = list;
            console.log('Came to ListGfBookComponent:bookList:' + this.bookList);
        });
    }
}
