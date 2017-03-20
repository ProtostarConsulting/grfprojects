import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

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
        private gfbookService: GFBookStockService,
        private http: Http) {
        this.bookList = new Array<GFBook>();
        console.log('came to contructor...');
        this.instituteID = +this.book.instituteID;
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        this.getGFBookByInstituteId();
    }

    getGFBookByInstituteId(): void {
        console.log('Came to ListGfBookComponent:getGFBookByInstituteId');
        this.gfbookService.getGFBookByInstituteId(this.instituteID).then(list => {
            this.bookList = list;
            console.log('Came to ListGfBookComponent:bookList:' + this.bookList);
        });
    }

    downloadData() {
        let params = new URLSearchParams();
        params.set('InstituteId', this.instituteID.toString());
        return this.http.get('http://localhost:8888/DownloadGFBooks', { search: params })
            .toPromise()
            .then((response: any) => {
                let headers = response.headers;
                console.log("headers: " + headers);
                let data1 = response._body;
                let saveAs = require('file-saver');
                let blob = new Blob([data1], { type: 'application/csv;charset=utf-8' });
                saveAs(blob, "GFBookData_" + new Date().toLocaleDateString() + ".csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    gotoGfbook(selectedBook: GFBook) {
        this.routeData.params = { 'selectedBook': selectedBook };
        this.router.navigate(['/gfbook-index/addgfbook']);
    }

    gotoviewGfbookRecord(selectedBook: GFBook) {
        this.routeData.params = { 'selectedBook': selectedBook };
        this.router.navigate(['/gfbook-index/viewgfbookrecord']);
    }
}
