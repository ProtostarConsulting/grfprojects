import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import { RouteData } from '../route-data.provider';
import { GFBookStockService } from '../gfbook/gfbook.service';
import { PartnerSchoolService } from '../partnerschool/school.service';
import { PartnerSchool } from '../partnerschool/partner-school';

@Component({
    moduleId: module.id,
    selector: 'proerp-view-gfbookRecord',
    templateUrl: 'view-gfbookRecord.component.html',
    styleUrls: ['./feature.component.css']
})

export class ViewBookRecordComponent {
    selectedBookQty: any[];
    schoolList: PartnerSchool[];
    private bookID: string;
    totalBookQty: number;
    bookName: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolservice: PartnerSchoolService,
        private gfbookService: GFBookStockService,
        private http: Http) {
        console.log('came to contructor...');
        this.selectedBookQty = [];
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        if (this.routeData.params.selectedBook) {
            this.bookID = this.routeData.params.selectedBook;
            this.getGFBookById(this.bookID);
            this.fetchSchoolByBId();
            // Clean the data from routeData 
            this.routeData.params.selectedBook = null;
        }
    }

    fetchSchoolByBId() {
        this.totalBookQty = 0;
        this.partnerschoolservice.getSchoolByBId(this.bookID).then(list => {
            this.schoolList = list;
            for (let k = 0; k < this.schoolList.length; k++) {
                for (let i = 0; i < this.schoolList[k].examDetailList.length; i++) {
                    for (let j = 0; j < this.schoolList[k].examDetailList[i].bookSummary.bookDetail.length; j++) {
                        if (this.bookID == this.schoolList[k].examDetailList[i].bookSummary.bookDetail[j].bookName) {
                            this.totalBookQty = this.totalBookQty
                                + this.schoolList[k].examDetailList[i].bookSummary.bookDetail[j].totalStud;
                            this.selectedBookQty.push(this.schoolList[k].examDetailList[i].bookSummary.bookDetail[j].totalStud);
                        }
                    }
                }
            }
        });
    }

    getGFBookById(id: string) {
        this.gfbookService.getGFBookById(id).then(bookObj => {
            this.bookName = bookObj.bookName;
        });
    }

    gotobooklist() {
        this.router.navigate(['/gfbook-index/listgfbook']);
    }

    getRowStyle(even: number): any {
        if (!even) {
            return {
                'border': '1px solid black',
                'text-align': 'left',
                'padding': '2px',
                'background-color': '#8cced4'
            };
        } else {
            return {
                'border': '1px solid black',
                'text-align': 'left',
                'padding': '2px'
            };
        }
    }

    getTHStyle(): any {
        return {
            'border': '1px solid black',
            'text-align': 'center',
            'padding': '5px',
            'background-color': '#44acb6'
        };
    }
}