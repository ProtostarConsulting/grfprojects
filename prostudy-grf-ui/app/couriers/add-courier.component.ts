import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { courierTypelist, logisticsList } from '../core/constant.app';
import { PartnerSchool } from '../partnerschool/partner-school';
import { CourierSerivces, GFCourier } from './courier.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-add-courier',
    templateUrl: './add-courier.component.html',
    styleUrls: ['./feature.component.css']
})

export class AddCourierComponent implements OnInit {

    courier:GFCourier;
    tempCourier:GFCourier;
    courierTypelist:string[];
    logisticsList:string[];
    school:PartnerSchool;
    yearOfExam: string;
    courierType:string;
    courierDispatchDate:Date = new Date();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        
    ) {
        this.courierTypelist = courierTypelist;
        this.logisticsList = logisticsList;
        console.log("inside add courier page");
    }

    ngOnInit() {
        if (this.routeData.params.selectedSchool) {
            this.school = this.routeData.params.selectedSchool;
            this.yearOfExam = this.routeData.params.yearOfExam;
            let myVal = Boolean(this.yearOfExam);
            console.log('this.user.id: ' + this.school.id);
            // Clean the data from routeData 
            this.routeData.params.selectedSchool = null;
        }
    }

    if( myVal = true || this.yearOfExam != undefined){
        this.tempCourier.courierTo = this.school.schoolName+
                                    ", "+this.school.address.line1+
                                    ", "+this.school.address.city+
                                    ", "+this.school.address.state+
                                     ", "+"PIN-"+
                                     this.school.address.pin;
        this.tempCourier.courierFrom = "Protostar, E101, MG Apts, Kasarwadi, Pune";                             
    }

    addCourier(){
        this.courier.schoolName = this.school;
        this.courier.courierFrom = this.tempCourier.courierFrom;
        this.courier.courierTo = this.tempCourier.courierTo;
        this.courier.autoGenerated = this.school.autoGenerated;
        this.courier.courierDispatchDate = this.courierDispatchDate;
    }
}