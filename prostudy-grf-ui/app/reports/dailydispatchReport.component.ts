import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { HttpModule, JsonpModule, Http, Headers, Response } from '@angular/http';

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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private courierservice: CourierSerivces) {
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
}