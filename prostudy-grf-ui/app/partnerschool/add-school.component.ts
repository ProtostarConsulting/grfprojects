import {
    Component, Optional, OnInit, AfterContentInit, ContentChild,
    AfterViewChecked, AfterViewInit, ViewChild, ViewChildren
} from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { RouteData } from '../route-data.provider';

import { PartnerSchoolService } from './school.service';
import { PartnerSchool, Address, ExamDetail, ContactDetail, CoordinatorDetail, PaymentDetail, BookSummary, BookDetail, NotificationData } from './partner-school';
import { GFBookStockService, GFBook } from '../gfbook/gfbook.service';
import { standardList, partnerSchoolLevels, IndiaStatesInfo, indiaAddressLookupData } from '../core/constant.app';

@Component({
    moduleId: module.id,
    selector: 'proerp-add-school',
    templateUrl: './add-school.component.html',
    styleUrls: ['./feature.component.css']
})

export class AddSchoolComponent implements OnInit {

    @ViewChildren('govRegisterno') vc: any;
    ngAfterViewInit() {
        this.vc.first.nativeElement.focus();
    }

    maxTabNo = 5;
    visible = true;
    selectedIndex = 0;
    selectedPSchoolId: string = "";
    partnerSchoolLevels: string[];
    standardList: string[];
    currentSchool: PartnerSchool;
    bookStocks: GFBook[];
    Years: Array<string> = [];
    id: string;
    country: IndiaStatesInfo;
    school: PartnerSchool = new PartnerSchool();
    address: Address = new Address();
    examDetail: ExamDetail = new ExamDetail();
    notificationData: NotificationData = new NotificationData();
    contactDetail: ContactDetail = new ContactDetail();
    coordinatorDetail: CoordinatorDetail = new CoordinatorDetail();
    PaymentDetail: PaymentDetail = new PaymentDetail();
    PaymentDet: Array<PaymentDetail> = [];
    bookSummary: BookSummary = new BookSummary();
    bookDetail: BookDetail = new BookDetail();
    bankNameList: string[];
    paymentReceivedBy: string[];
    addPaymentFlag: boolean;
    tempPaymentData: any;
    temp: any;
    routeData: RouteData;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        routeData: RouteData,
        private partnerschoolService: PartnerSchoolService,
        private gfbookService: GFBookStockService
    ) {
        this.partnerSchoolLevels = partnerSchoolLevels;
        this.standardList = standardList;
        this.country = indiaAddressLookupData;
        this.bankNameList = ['Sri. Mahaveer Co-op. Bank Ltd.', 'State Bank of India', 'Axis Bank', 'Other'];
        this.paymentReceivedBy = ['Cash', 'D.D', 'NEFT/RTGS', '--'];
        this.addPaymentFlag = false;
        this.tempPaymentData = {
            otherNameOfBank: null
        };
        this.temp = {
            tempDistricts: [],
            tempTalukas: [],
            tempVillages: []
        };
        this.school.examDetailList = [];
        this.contactDetail.coordinatorDetail = [];
        this.examDetail.bookSummary.bookDetail = [];
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
        this.coordinatorDetail = {
            srno: 1,
            coordinatorName: "",
            coordinatorPhoneNum: "",
            coordinatorMobileNum: "",
            coordinatorEmailId: "",
        };
        this.PaymentDetail = {
            payReceivedBy: "",
            paymentDate: new Date(),
            payAmount: 0,
            note: "",
            tPaid: 0,
            pAmount: 0,
            nameOfBank: "",
            branchName: "",
            transactionNumber: "",
            depositDate: new Date(),
        };
        this.getCurYear();
        this.getPrvYears();
        this.getNextYears();
        this.routeData = routeData;
    }

    tabNext() {
        this.selectedIndex = (this.selectedIndex == this.maxTabNo) ? this.selectedIndex : this.selectedIndex + 1;
    }
    setCurrentTab(tabIndex: number) {
        this.selectedIndex = tabIndex;
    }
    enableTillTabNo = (this.selectedPSchoolId == "") ? 0 : this.maxTabNo;

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
        if (this.routeData.params.selectedSchool || this.routeData.params.isLoggedIn) {
            this.school = this.routeData.params.selectedSchool;
            this.school.schoolSelfUpdate = this.routeData.params.isLoggedIn;
            console.log('this.school.id: ' + this.school.id);
            // Clean the data from routeData
            this.initSchoolLoad(this.school);
            this.selectedPSchoolId = this.school.id;
            this.routeData.params.selectedSchool = null;
            this.routeData.params.isLoggedIn = null;
            this.enableTillTabNo = this.maxTabNo;
        }
        this.getGFBookStockByInstituteId();
        this.calculatepaidandpending();
    }

    saveSchool() {

        this.tabNext();
        this.enableTillTabNo++;

        this.calculatepaidandpending();
        if (this.PaymentDetail.payReceivedBy != "") {
            if (this.PaymentDetail.nameOfBank == 'Other') {
                this.PaymentDetail.nameOfBank = this.tempPaymentData.otherNameOfBank;
            }
            this.PaymentDet.push(this.PaymentDetail);
            this.examDetail.paymentDetail = (this.PaymentDet);
            this.PaymentDetail = {
                payReceivedBy: "",
                paymentDate: new Date(),
                payAmount: 0,
                note: "",
                tPaid: 0,
                pAmount: 0,
                nameOfBank: "",
                branchName: "",
                transactionNumber: "",
                depositDate: new Date(),
            };
        }


        this.examDetail.bookSummary = this.bookSummary;
        this.school.instituteID = +'5910974510923776';
        this.school.contactDetail = this.contactDetail;
        if (this.school.address.state == "Other") {
            this.school.address.state = this.school.address.otherState;
            this.school.address.dist = this.school.address.otherDist;
            this.school.address.tal = this.school.address.otherTal;
            this.school.address.otherAddressFlag = true;
        }
        else {
            this.school.address.otherAddressFlag = false;
        }
        this.school.address = this.address;

        if (this.currentSchool != undefined && this.selectedPSchoolId == "") {
            this.school.id = this.currentSchool.id;
        }
        this.getExamByYear('');

        this.school.examDetailList = this.examlist;
        this.partnerschoolService.saveSchool(this.school).then(schoolObj => {
            console.log('Saved currentSchool:' + this.currentSchool);
            this.currentSchool = schoolObj;
            if (this.currentSchool) {
                this.school.autoGenerated = this.currentSchool.autoGenerated;
                this.examDetail.notificationData = this.currentSchool.examDetailList[0].notificationData;
                if (this.school.examDetailList) {
                    this.examlist = this.currentSchool.examDetailList;
                    this.getExamByYear('');
                    this.addPaymentFlag = false;
                }
            }
        });

        this.calculatepaidandpending();
    }

    initSchoolLoad(pschool: any) {
        this.school = pschool;
        this.school.formNumber = this.school.formNumber;
        this.address = this.school.address;
        this.school.address.pin = this.school.address.pin;
        this.contactDetail = this.school.contactDetail;
        this.contactDetail.headMasterMobile = this.school.contactDetail.headMasterMobile;
        if (this.contactDetail.coordinatorDetail) {
            for (let i = 0; i < this.contactDetail.coordinatorDetail.length; i++) {
                this.contactDetail.coordinatorDetail[i].coordinatorMobileNum = this.contactDetail.coordinatorDetail[i].coordinatorMobileNum;
            }
        }

        if (this.school.address.state != "Maharashtra") {
            this.school.address.otherAddressFlag = true;
        }

        if (this.school.address.otherAddressFlag == false) {
            this.getDistricts(this.address.state);
            if (this.temp.tempDistricts)
                this.getTalukas(this.address.dist);
        }

        if (this.school.address.otherAddressFlag == true) {
            let temp = this.school.address.state;
            this.school.address.state = "Other";
            this.school.address.otherState = temp;
            this.school.address.otherDist = this.school.address.dist;
            this.school.address.otherTal = this.school.address.tal;
            this.school.address.otherAddressFlag = true;
        }

        if (this.school.examDetailList) {
            this.examlist = this.school.examDetailList;
        }

        this.getExamByYear('');
    }

    getGFBookStockByInstituteId(): void {
        this.gfbookService.getGFBookByInstituteId(this.school.instituteID).then(list => {
            this.bookStocks = list;
        });
    }
    examlist: Array<ExamDetail> = [];

    getExamByYear(year1: any) {
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
            this.bookSummary = {
                bookDetail: [{
                    standard: "",
                    bookName: "",
                    bookPrise: 0,
                    totalStud: 0,
                    totalFees: 0
                }],
                total: 0,
                amtForInst20per: 0,
                amtForGRF80per: 0
            };
            this.examDetail = {
                totalStudent: "",
                male: "",
                female: "",
                total: 0,
                yearOfExam: this.yearOfExam,
                bookRequired: 'OffLine',
                modeOfExam: 'OffLine',
                notificationData: this.notificationData,
                bookSummary: this.bookSummary,
                paymentDetail: this.PaymentDet,
            };
        };

        this.examlist = [];
        this.examlist.push(this.examDetail);
        this.examDetail = this.examlist[this.examlist.length - 1];
    }

    addBook() {
        this.bookSummary.bookDetail.push({
            standard: "",
            bookName: "",
            bookPrise: 0,
            totalStud: 0,
            totalFees: 0
        });
    }

    removeBook(index: number) {
        this.calculate(index, 0);
        this.bookSummary.bookDetail.splice(index, 1);
    }

    calculate(index: number, val: number) {
        this.bookSummary.bookDetail[index].totalStud = val;
        this.bookSummary.bookDetail[index].totalFees = this.bookSummary.bookDetail[index].totalStud
            * this.bookSummary.bookDetail[index].bookPrise;
        this.bookSummary.total = 0;
        for (let count = 0; count < this.bookSummary.bookDetail.length; count++) {
            this.bookSummary.total += this.bookSummary.bookDetail[count].totalFees;
        }

        this.bookSummary.amtForInst20per = Math
            .round((this.bookSummary.total / 100) * 20);
        this.bookSummary.amtForGRF80per = Math
            .round((this.bookSummary.total / 100) * 80);
        this.calculatepaidandpending();
        this.calculateActualStudTotal();
    }

    calculateActualStudTotal() {
        this.examDetail.total = 0;
        for (let i = 0; i < this.bookSummary.bookDetail.length; i++) {
            this.examDetail.total += Number(this.bookSummary.bookDetail[i].totalStud);
        }
    }

    setfees(id: string, index: number) {
        for (let i = 0; i < this.bookStocks.length; i++) {
            if (this.bookStocks[i].id == id) {
                this.bookSummary.bookDetail[index].bookPrise = this.bookStocks[i].bookPrice;
            }
        }
        this.calculate(index, 0);
    }

    calculatepaidandpending() {
        this.PaymentDetail.tPaid = 0;

        if (this.PaymentDet.length != 0) {

            for (let i = 0; i < this.PaymentDet.length; i++) {
                this.PaymentDetail.tPaid += Number(this.PaymentDet[i].payAmount);
            }
            this.PaymentDetail.tPaid += Number(this.PaymentDetail.payAmount);
            this.PaymentDetail.pAmount = this.bookSummary.amtForGRF80per
                - this.PaymentDetail.tPaid;
        } else {
            this.PaymentDetail.tPaid = Number(this.PaymentDetail.payAmount);
            this.PaymentDetail.pAmount = this.bookSummary.amtForGRF80per
                - this.PaymentDetail.tPaid;
        }
    }

    enableAddPaymentFlag() {
        this.addPaymentFlag = true;
    }

    onlineChClicked() {
        if (this.examDetail.modeOfExam == '' || this.examDetail.modeOfExam == 'OffLine') {
            this.examDetail.modeOfExam = 'OnLine';
        } else {
            this.examDetail.modeOfExam == ''
        }
    }
    offlineChClicked() {
        if (this.examDetail.modeOfExam == '' || this.examDetail.modeOfExam == 'OnLine') {
            this.examDetail.modeOfExam = 'OffLine';
        } else {
            this.examDetail.modeOfExam == ''
        }
    }

    onlinebookChClicked() {
        if (this.examDetail.bookRequired == '' || this.examDetail.bookRequired == 'OffLine') {
            this.examDetail.bookRequired = 'OnLine';
        } else {
            this.examDetail.bookRequired == ''
        }
    }

    offlinebookChClicked() {
        if (this.examDetail.bookRequired == '' || this.examDetail.bookRequired == 'OnLine') {
            this.examDetail.bookRequired = 'OffLine';
        } else {
            this.examDetail.bookRequired == ''
        }
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
                coordinatorPhoneNum: "",
                coordinatorMobileNum: "",
                coordinatorEmailId: "",
            };
            this.contactDetail.coordinatorDetail.push(this.coordinatorDetail);
        }
    }
    removeCoordinator(index: any) {
        this.contactDetail.coordinatorDetail.splice(index, 1);
    }

    getDistricts(state: string) {
        this.temp.tempDistricts = [];
        for (let i = 0; i < this.country.states.length; i++) {
            if (this.country.states[i].name == state) {
                this.temp.tempDistricts = this.country.states[i].districts;
            }
        }
    }

    getTalukas(district: string) {
        this.temp.tempTalukas = [];
        for (let i = 0; i < this.temp.tempDistricts.length; i++) {
            if (this.temp.tempDistricts[i].name == district) {
                this.temp.tempTalukas = this.temp.tempDistricts[i].talukas;
            }
        }
    }

    getVillages(taluka: string) {
        this.temp.tempVillages = [];
        for (let i = 0; i < this.temp.tempTalukas.length; i++) {
            if (this.temp.tempTalukas[i].name == taluka) {
                this.temp.tempVillages = this.temp.tempTalukas[i].villages;
            }
        }
    }

    gotoprintbookdetails(selectedSchool: PartnerSchool, bookStocks: GFBook, yearOfExam: string) {
        this.routeData.params = { 'selectedSchool': selectedSchool, 'bookStocks': bookStocks, 'yearOfExam': yearOfExam };
        this.router.navigate(['/school-index/printbookdetails']);
    }

    gotoprintaddess(selectedSchool: PartnerSchool, yearOfExam: string) {
        this.routeData.params = { 'selectedSchool': selectedSchool, 'yearOfExam': yearOfExam };
        this.router.navigate(['/school-index/printaddress']);
    }

    gotoAddCourier(selectedSchool: PartnerSchool, yearOfExam: string) {
        this.routeData.params = { 'selectedSchool': selectedSchool, 'yearOfExam': yearOfExam };
        this.router.navigate(['/courier-index/addCourierFromPS']);
    }

}