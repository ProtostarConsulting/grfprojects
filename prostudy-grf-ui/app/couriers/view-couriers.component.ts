import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { GoogleEndpointService } from '../core/google-endpoint.service';
import { CourierSerivces, GFCourier } from './courier.service';
import { GFBookStockService, GFBook } from '../gfbook/gfbook.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-view-courier',
    templateUrl: 'view-couriers.component.html',
    styleUrls: ['./feature.component.css']
})

export class ViewCourierComponent {

    id: string;
    courier: GFCourier = new GFCourier();
    bookStocks: GFBook[];
    schoolName: string;
    instituteID: number = 5910974510923776;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private courierservice: CourierSerivces,
        private gfbookService: GFBookStockService) {
        console.log('came to contructor...');
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        if (this.routeData.params.selectedCourierID) {
            this.id = this.routeData.params.selectedCourierID;
            this.getGFCourierById(this.id);
            console.log('this.user.id: ' + this.id);
            // Clean the data from routeData 
            this.routeData.params.selectedCourierID = null;
        }
        this.getGFBookStockByInstituteId();
    }

    getGFCourierById(id: string) {
        this.courierservice.getGFCourierById(id).then(list => {
            this.courier = list;
            this.courier.courierDispatchDate = new Date(this.courier.courierDispatchDate);
            this.schoolName = this.courier.schoolName.schoolName;
        });
    }

    getGFBookStockByInstituteId(): void {
        this.gfbookService.getGFBookByInstituteId(this.instituteID).then(list => {
            this.bookStocks = list;
        });
    }

    printDiv = function (divId: any) {
        window.frames["print_frame"].document.body.innerHTML = document
            .getElementById(divId).innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
    }

    gotolist(){
        this.router.navigate(['/courier-index/listcourier']);
    }
}