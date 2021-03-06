import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { RouteData } from '../route-data.provider';

import { PartnerSchoolService } from '../partnerschool/school.service';
import { PartnerSchool, CoordinatorDetail, BookDetail } from '../partnerschool/partner-school';

@Component({
    moduleId: module.id,
    selector: 'proerp-add-examdetail',
    templateUrl: './add-examdetail.component.html',
    styleUrls: ['./feature.component.css']
})

export class AddExamDetailComponent {

    data: any;
    foundSchool: PartnerSchool;
    coordinatorDetail: CoordinatorDetail;
    bookDetailList: BookDetail[];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolservice: PartnerSchoolService) {
        this.data = {
            grfRegNo: '',
            coordinatorMobileNumberEntered: '',
            foundValidRecord: false,
            errorMsg: '',
            guestSuccessMsg: ''
        };
    }

    ngOnInit() {  }

    grfRegNoChange(autoGenerated: string) {
        this.foundSchool = null;
        this.data.foundValidRecord = false;
        this.data.guestSuccessMsg = '';
        this.partnerschoolservice.getInstituteByGRFNo(autoGenerated).then(schoolObj => {
            if (schoolObj) {
                this.foundSchool = schoolObj;
            }
            if (this.foundSchool == null) {
                this.data.errorMsg = "This GRF. Reg. No. is not found. Please correct it and try. Please contact GRF office.";
                return;
            }
            else {
                let studPerStd = 3;
                let contactDetail = this.foundSchool.contactDetail;
                this.coordinatorDetail = null;
                if (contactDetail.coordinatorDetail != undefined
                    && contactDetail.coordinatorDetail.length > 0) {
                    this.coordinatorDetail = contactDetail.coordinatorDetail[0];
                }
                let userEnteredCoOrdMobileNo = '91'
                    + this.data.coordinatorMobileNumberEntered;

                if ((this.coordinatorDetail == null || userEnteredCoOrdMobileNo
                    .indexOf(this.coordinatorDetail.coordinatorMobileNum) == -1)) {
                    this.data.errorMsg = "Entered co-ordinator number did not match with our records. Please contact GRF office.";
                    return;
                }

                this.bookDetailList = this.getBookDetailList(this.foundSchool);

                if (this.bookDetailList == null) {
                    this.data.errorMsg = "There are no book details associated with this school/college. Please contact GRF office.";
                    this.foundSchool = null;
                    return;
                }

                this.data.foundValidRecord = true;
                this.routeData.params = { 'selectedSchool': this.foundSchool};
                this.router.navigate(['/examdetail-index/updateSchool_withoutlogin']);
            }
        });
    }

    year1: string;
    getBookDetailList = function (school: PartnerSchool) {
        if (this.year1 == undefined) {
            let date1 = new Date(2016, 11, 11);
            let year = date1.getFullYear();
            this.year1 = year.toString().substr(2, 2);
            this.year1 = date1.getFullYear() + "-"
                + (Number(this.year1) + 1);
        }
        this.bookDetailList = [];
        for (let q = 0; q < school.examDetailList.length; q++) {
            if (school.examDetailList[q].yearOfExam == this.year1) {
                if (school.examDetailList[q].bookSummary) {
                    this.bookDetailList = school.examDetailList[q].bookSummary.bookDetail;
                    this.examDetail = school.examDetailList[q];
                } else {
                    return null;
                }
            }
        }
        return this.bookDetailList;
    }
}