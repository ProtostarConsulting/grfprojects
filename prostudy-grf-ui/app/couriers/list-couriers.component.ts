import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { GoogleEndpointService } from '../core/google-endpoint.service';
import { CourierSerivces, GFCourier } from './courier.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-list-courier',
    templateUrl: 'list-couriers.component.html',
    styleUrls: ['./feature.component.css']
})

export class ListCourierComponent {

    gfCouriertList:GFCourier[];
    courier:GFCourier = new GFCourier();
    instituteID:number = 5910974510923776;
    constructor(private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private courierservice:CourierSerivces) {
        this.gfCouriertList = new Array<GFCourier>();
        console.log('came to contructor...');
    }

    ngOnInit(){
        console.log('came to ngOnInit...');
        this.getGFCourierByInstitute();
    }

    getGFCourierByInstitute(): void {
        console.log('Came to ListSchoolComponent:getPartnerByInstitute');
        this.courierservice.getGFCourierByInstitute(this.instituteID).then(list => {
            this.gfCouriertList = list;
            console.log('Came to ListSchoolComponent:schoolList:' + this.gfCouriertList.length);
        });
    }

    gotoViewCourier(selectedCourierID:string){
        this.routeData.params = { 'selectedCourierID': selectedCourierID };
        this.router.navigate(['/courier-index/viewcourier']);
    }

    gotoEditCourier(selectedCourierID:string){
        this.routeData.params = { 'selectedCourierID': selectedCourierID };
        this.router.navigate(['/courier-index/addCourier']);
    }

    gotoAddCourier(schoolGRFNo:string){
        this.routeData.params = { 'schoolGRFNo': schoolGRFNo };
        this.router.navigate(['/courier-index/addCourier']);
    }
}
