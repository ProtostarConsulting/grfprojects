import { Component, Optional, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { saveAs } from 'file-saver';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';


import { PartnerSchoolService } from '../partnerschool/school.service';
import { CourierSerivces, GFCourier } from '../couriers/courier.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-fin-summary',
    templateUrl: './fin_summary.component.html',
    styleUrls: ['./feature.component.css']
})

export class FinSummaryCompoent {

    noOfPaymentsTotal: number;
    noOfCourierParcelsTotal: number;
    instituteID: number;
    finSummayReportData: any;
    t_totalAmountByPaymentType: number;
    t_totalCostByLogisticType: number;
    filterType: string;
    filterPaymentType: string;
    filterLogisticsType: string;
    curyear1: string;
    yearOfExam: string;
    paymentDetailList: any;
    fitlteredSchoolList: any;
    fitlteredCourierList: any;
    otherFilterType: string;
    filterSubType: string;
    displayButton: boolean;
    paymentModesData: any;
    logisticsWiseData: any;
    amountPaymentsTotal: number;
    chargesCourierTotal: number;
    dataObj: any;
    error: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolservice: PartnerSchoolService,
        private courierservice: CourierSerivces,
        private http: Http) {
        this.filterType = '';
        this.paymentModesData = [];
        this.logisticsWiseData = [];
    }

    ngOnInit() {
        this.instituteID = 5910974510923776;
        this.getCurYear();
        this.getFinSummayReportData();
    }

    getFinSummayReportData() {
        this.noOfPaymentsTotal = 0;
        this.noOfCourierParcelsTotal = 0;

        this.partnerschoolservice.getFinSummayReportData(this.instituteID).then(list => {
            this.finSummayReportData = list;
            this.paymentModesData = this.finSummayReportData.paymentModesData;
            this.amountPaymentsTotal = this.finSummayReportData.amountPaymentsTotal;
            this.finSummayReportData.paymentModesData.forEach((paymodeObj: any) => {
                this.noOfPaymentsTotal += parseInt(paymodeObj.noOfPayments);
            });
            this.logisticsWiseData = this.finSummayReportData.logisticsWiseData;
            this.chargesCourierTotal = this.finSummayReportData.chargesCourierTotal;
            this.finSummayReportData.logisticsWiseData.forEach((logisticsObj: any) => {
                this.noOfCourierParcelsTotal += parseInt(logisticsObj.noOfParcels);
            });

        });

    }

    t_addTotalAmountByPaymentType(amt: any) {
        return this.t_totalAmountByPaymentType;
    }

    t_addTotalCostByLogisticType = function (cost: any) {
        return this.t_totalCostByLogisticType;
    }

    clearfilterValues(courierType: any) {
        this.filterType = '';
        this.filterPaymentType = '';
        this.filterLogisticsType = '';
        this.t_totalAmountByPaymentType = 0;
        this.t_totalCostByLogisticType = 0;
    }

    getCurYear() {
        let date = new Date(2016, 11, 11);
        let curyear = date.getFullYear();
        this.curyear1 = curyear.toString().substr(2, 2);
        this.yearOfExam = date.getFullYear() + "-"
            + (Number(this.curyear1) + 1);
    }

    getPaymentTotalCurrentYear(school: any) {
        this.paymentDetailList = [];
        for (let q = 0; q < school.examDetailList.length; q++) {
            if (school.examDetailList[q].yearOfExam == this.yearOfExam) {
                if (school.examDetailList[q].paymentDetail != undefined) {
                    this.paymentDetailList = school.examDetailList[q].paymentDetail;
                    break;
                }
            }
        }

        let paymentDetailCal = {
            'payTotal': 0,
            'paymentDate': ''
        }

        if (this.paymentDetailList && this.paymentDetailList.length > 0) {
            let payTotal = 0;
            let paymentDate = '';
            for (let i = 0; i < this.paymentDetailList.length; i++) {
                if (this.filterPaymentType == this.paymentDetailList[i].payReceivedBy
                    .trim()) {
                    payTotal += this.paymentDetailList[i].payAmount;
                    paymentDate = this.paymentDetailList[i].paymentDate;
                }
            }

            paymentDetailCal.payTotal = payTotal;
            paymentDetailCal.paymentDate = paymentDate;
            this.t_totalAmountByPaymentType += payTotal;
        }

        school.paymentDetailCal = paymentDetailCal;
    }

    filterSchoolListBy(paymentType: string) {
        this.fitlteredSchoolList = [];
        this.t_totalAmountByPaymentType = 0;

        this.partnerschoolservice.getSchoolByPaymentMode(paymentType).then(list => {
            this.fitlteredSchoolList = list;
            this.fitlteredSchoolList.forEach((school: any) => {
                this.getPaymentTotalCurrentYear(school);
            });
        });
    }

    filterCourierListBy(courierLogistics: any) {
        this.fitlteredCourierList = [];
        this.t_totalCostByLogisticType = 0;
        this.courierservice.getCourierByLogisticsType(courierLogistics).then(list => {
            this.fitlteredCourierList = list;

            this.fitlteredCourierList.forEach((courier: any) => {
                this.t_totalCostByLogisticType += courier.courierCost;
            });
        });
    }

    filterBy(fType: string, fSubType: string) {
        this.otherFilterType = fType;
        this.filterSubType = fSubType;

        this.displayButton = true;
        this.filterType = fType;
        if (this.filterType == "school") {
            this.filterPaymentType = fSubType;
            this.filterSchoolListBy(fSubType);

        } else if (this.filterType == "courier") {
            this.filterLogisticsType = fSubType;
            this.filterCourierListBy(fSubType);

        }
    }

    downloadSummaryReport = function () {
        window.location.href = "DownloadFinicialSummaryReport?summaryReportFilterType1="
            + this.otherFilterType
            + "&summaryReportFilterType2="
            + this.filterSubType;
    }

    downloadFile(data: Response) {
        var blob = new Blob([data], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        window.open(url);
    }

    downloadFileTemp(): any {

        /**let data = 'fname, lname, gan, law, ravi, sharma';      
        let saveAs = require('file-saver');
        let blob = new Blob([JSON.stringify(data)], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, "file.csv");
        let url = window.URL.createObjectURL(blob);
        window.open(url);*/
        let params = new URLSearchParams();
        params.set('summaryReportFilterType1', this.otherFilterType);
        params.set('summaryReportFilterType2', this.filterSubType);

        /**return this.http.get('http://localhost:8888/DownloadFinicialSummaryReport', { search: params })
            .map((res: Response) => {
                let data = res.json();
                //let data = 'fname, lname, gan, law, ravi, sharma';
                let saveAs = require('file-saver');
                let blob = new Blob([JSON.stringify(data)], { type: 'text/plain;charset=utf-8' });
                saveAs(blob, "file.csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);

            });*/

        return this.http.get('http://localhost:8888/DownloadFinicialSummaryReport', { search: params })
            .toPromise()
            .then((response: any) => {
                let headers = response.headers;
                console.log("headers: " + headers);
                let data1 = response._body;
                let saveAs = require('file-saver');
                let blob = new Blob([data1], { type: 'application/csv;charset=utf-8' });
                saveAs(blob, "file.csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
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