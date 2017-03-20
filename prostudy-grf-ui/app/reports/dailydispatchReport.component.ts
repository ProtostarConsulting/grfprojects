import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import { CourierSerivces, GFCourier } from '../couriers/courier.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-courier-dispatch-report',
    templateUrl: './dailydispatchReport.component.html',
    styleUrls: ['./feature.component.css']
})

export class DailyDispatchReportCompoent {

    dateChanged: boolean;
    couriertFilteredList: any;
    courierDispatchDate: Date = new Date();
    instituteID: number;
    postResponse: GFCourier;
    dateobj: Date = new Date();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private courierservice: CourierSerivces,
        private http: Http) {
        this.dateChanged = true;
        this.instituteID = 5910974510923776;
    }

    ngOnInit() { }

    getCourierFilteredList() {
        this.couriertFilteredList = [];
        this.courierDispatchDate = new Date(this.courierDispatchDate);
        this.courierservice.getCourierByDispatchDate(this.courierDispatchDate.getTime()).then(list => {
            this.couriertFilteredList = list;
            this.dateChanged = false;
        });
    }

    printDiv(bookDetailDiv: any) {
        window.frames["print_frame"].document.body.innerHTML = document.getElementById(bookDetailDiv).innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
    }

    downloadcourierdispatchReport(){
       
        let params = new URLSearchParams();
        params.set('courierDispatchReportByInstituteID', this.instituteID.toString());
        params.set('dispatchDate', this.courierDispatchDate.getTime().toString());

        return this.http.get('http://localhost:8888/DownloadCourierDispatchReport', { search: params })
            .toPromise()
            .then((response: any) => {
                let headers = response.headers;
                console.log("headers: " + headers);
                let data1 = response._body;
                let saveAs = require('file-saver');
                let blob = new Blob([data1], { type: 'application/csv;charset=utf-8' });
                saveAs(blob, "CourierDispatchReportData_"+new Date().toLocaleDateString()+".csv");
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