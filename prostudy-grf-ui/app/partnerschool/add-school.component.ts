import { Component, Optional, OnInit,AfterContentInit, ContentChild,
  AfterViewChecked, AfterViewInit, ViewChild,ViewChildren } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { RouteData } from '../route-data.provider';

import { PartnerSchoolService } from './school.service';
import { PartnerSchool, Address, ExamDetail, ContactDetail, CoordinatorDetail, PaymentDetail, BookSummary, BookDetail } from './partner-school';

@Component({
    moduleId: module.id,
    selector: 'proerp-add-school',
    templateUrl: './add-school.component.html',
    styleUrls: ['./feature.component.css']
})

export class AddSchoolComponent implements OnInit {

    @ViewChildren('govRegisterno') vc:any;
    @ViewChildren('totalStudent') vc1:any;

    ngAfterViewInit() {            
        this.vc.first.nativeElement.focus();
        this.vc1.first.nativeElement.focus();
    }

    maxTabNo = 5;
    visible = true;
    selectedIndex = 0;
    selectedPSchoolId: string = "";
    partnerSchoolLevels :string[];
    standardList: string[];

    tabNext() {
        let index = (this.selectedIndex == this.maxTabNo) ? this.selectedIndex : this.selectedIndex + 1;
    }
    setCurrentTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }
    enableTillTabNo = (this.selectedPSchoolId == "") ? 0 : this.maxTabNo;    

    Years: Array<string> = [];
    id: string;
    school: PartnerSchool = new PartnerSchool();
    address: Address = new Address();
    examDetail: ExamDetail = new ExamDetail();
    contactDetail: ContactDetail = new ContactDetail();
    coordinatorDetail: CoordinatorDetail = new CoordinatorDetail();
    PaymentDetail: PaymentDetail = new PaymentDetail();
    PaymentDet: Array<PaymentDetail> = [];
    bookSummary: BookSummary = new BookSummary();
    bookDetail:BookDetail = new BookDetail();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolService: PartnerSchoolService
    ) {
        this.partnerSchoolLevels = ["School & Junior College","Jr.& Sr. College","D.Ed College","Prison","B.Ed College","MBBS","Nurses Course","Engineearing","All"];
        this.standardList = ["5th", "6th", "7th", "8th", "9th", "10th",
		"11th", "12th", "FY", "SY", "TY", "Fr. Y", "PG/D. & B. Ed-1", "PG/D. & B. Ed-2", "Teacher" ];
        this.school.examDetailList = [];
        this.contactDetail.coordinatorDetail = [];
        this.getCurYear();
        this.getPrvYears();
        this.getNextYears();

    }

    year: string;
    curyear1: string;
    yearOfExam: string;
    getNextYears = function () {
        let date = new Date();
        for (let i = 0; i < 3; i++) {
            let year = date.getFullYear();
            this.year = year.toString().substr(2, 2);
            this.Years.push(date.getFullYear() + "-"
                + (Number(this.year) + 1));
            date.setFullYear(date.getFullYear() + 1);
        }
    }

    getCurYear() {
        let date = new Date(2016, 11, 11);
        let da = new Date();
        let curyear = date.getFullYear();
        this.curyear1 = curyear.toString().substr(2, 2);
        this.yearOfExam = date.getFullYear() + "-"
            + (Number(this.curyear1) + 1);
    }

    getPrvYears = function () {
        let date = new Date();
        for (let i = 0; i < 3; i++) {
            let year = date.getFullYear();
            this.year = year.toString().substr(2, 2);
            this.Years.push((date.getFullYear() - 1) + "-"
                + (Number(this.year)));
            date.setFullYear(date.getFullYear() - 1);
        }

    }

    ngOnInit() {
        if (this.routeData.params.selectedSchool) {
            this.school = this.routeData.params.selectedSchool;
            console.log('this.school.id: ' + this.school.id);
            // Clean the data from routeData
            this.selectedPSchoolId = this.school.id; 
            this.routeData.params.selectedSchool = null;
        }
    }

    examlist: Array<ExamDetail> = [];

    getExamByYear(year1:any) {
        if (year1 == '') {
            let date1 = new Date(2016, 11, 11);
            let year = date1.getFullYear();
            year1 = year.toString().substr(2, 2);
            year1 = date1.getFullYear() + "-"
                + (Number(year1) + 1);
        }
        let k = 0;
        for (let i = 0; i < this.examlist.length; i++) {
            if (this.examlist[i].yearOfExam == year1) {
                this.examDetail = this.examlist[i];
                this.bookSummary = this.examlist[i].bookSummary;
                if (this.examlist[i].paymentDetail != undefined) {
                    this.PaymentDet = this.examlist[i].paymentDetail;
                }
                this.examDetail.totalStudent = this.examlist[i].totalStudent;
                this.examDetail.male = this.examlist[i].male;
                this.examDetail.female = this.examlist[i].female;
                this.examDetail.total = this.examlist[i].total;
                this.calculateActualStudTotal();
                if (this.bookSummary != undefined) {
                    k = 1;
                }
            }
        }
        if (k == 0) {
            this.PaymentDet = [];
            this.bookSummary.bookDetail = [];
            this.examDetail.bookSummary = this.bookSummary;
            this.examDetail.yearOfExam = this.yearOfExam;
            this.examlist.push(this.examDetail);
            this.examDetail = this.examlist[this.examlist.length - 1];
        }

    }

    saveSchool() {
        this.tabNext();
        this.enableTillTabNo++;
        this.school.address = this.address;
       
        this.examDetail.bookSummary = this.bookSummary;
        this.school.instituteID = +'5910974510923776';
       
        this.school.examDetailList.push(this.examDetail);
        this.contactDetail.coordinatorDetail.push(this.coordinatorDetail);
        this.school.contactDetail = this.contactDetail;
        //this.bookSummary.bookDetail.push(this.bookDetail);
        this.school.examDetailList.push(this.examDetail);
        //this.examDetail.bookSummary = this.bookSummary;
        this.getExamByYear('');
        this.partnerschoolService.saveSchool(this.school);
    }

    addCoordinator() {
        if (this.contactDetail.coordinatorDetail == undefined) {
            this.contactDetail = {
                headMasterName: "",
                headMasterMobile: "",
                headMasterPhone: "",
                headMasterEmailId: "",
                coordinatorDetail: [{
                    srno: 1,
                    coordinatorName: "",
                    coordinatorPhoneNum: "",
                    coordinatorMobileNum: "",
                    coordinatorEmailId: "",
                }]
            };
        }
        else {
            this.coordinatorDetail = {
                srno: this.contactDetail.coordinatorDetail.length + 1,
                coordinatorName: "",
                coordinatorPhoneNum:"",
                coordinatorMobileNum: "",
                coordinatorEmailId: "",
            };
            this.contactDetail.coordinatorDetail.push(this.coordinatorDetail);
        }
    }
    removeCoordinator(index: any) {
        this.contactDetail.coordinatorDetail.splice(index, 1);
    }

    calculateActualStudTotal(){
        this.examDetail.total = '0';
        for(let i=0; i< this.bookSummary.bookDetail.length; i++){
            this.examDetail.total += this.bookSummary.bookDetail[i].totalStud;
        }
    }
}