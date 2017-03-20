import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

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
        private gfbookService: GFBookStockService,
        private http: Http) {
        this.bookStocks = new Array<GFBookTransaction>();
        console.log('came to contructor...');
        this.instituteID = 5910974510923776;
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

    downloadBookTranscation(){
        let params = new URLSearchParams();
        params.set('BookStockTransactionByInstituteId', this.instituteID.toString());

        return this.http.get('http://localhost:8888/DownloadBookStockTransaction', { search: params })
            .toPromise()
            .then((response: any) => {
                let headers = response.headers;
                console.log("headers: " + headers);
                let data1 = response._body;
                let saveAs = require('file-saver');
                let blob = new Blob([data1], { type: 'application/csv;charset=utf-8' });
                saveAs(blob, "BookTransactionData_"+new Date().toLocaleDateString()+".csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}