import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { PartnerSchoolService } from './school.service';
import { PartnerSchool, ContactDetail, Address, ExamDetail, BookSummary, BookDetail, PaymentDetail } from './partner-school';
import { GFBookStockService, GFBook } from '../gfbook/gfbook.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-print-bookdetails',
    templateUrl: 'print-bookdetails.component.html',
    styleUrls: ['./feature.component.css']
})

export class PrintBookDetailsComponent {

    yearOfExam: string;
    bookStocks: GFBook[];
    school: PartnerSchool = new PartnerSchool();
    date: Date = new Date();
    receiptNumber: number = 0;
    examList: Array<ExamDetail>;
    ContactDetail: ContactDetail = new ContactDetail();
    add: Address = new Address();
    coordinatorName: string;
    coordinatorMobileNum: string;
    bookSummary: BookSummary = new BookSummary();
    BookDetail: BookDetail[];
    PaymentDet: PaymentDetail[];
    totalStudents: number;
    totalPaidFees: number;
    rangeArray: number[];


    constructor(private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolService: PartnerSchoolService) {
        console.log('came to contructor...');
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        if (this.routeData.params.selectedSchool) {
            this.school = this.routeData.params.selectedSchool;
            this.yearOfExam = this.routeData.params.yearOfExam;
            this.bookStocks = this.routeData.params.bookStocks;
            console.log('this.school.id: ' + this.school.id);
            this.initBookDetails(this.school);
            // Clean the data from routeData
        }
    }

    printBookDetailDiv(bookDetailDiv: any) {
        window.frames["print_frame"].document.body.innerHTML = document.getElementById(bookDetailDiv).innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
    }

    initBookDetails(pSchool: PartnerSchool) {
        this.examList = pSchool.examDetailList;
        this.add = pSchool.address;
        this.ContactDetail = pSchool.contactDetail;
        if (this.ContactDetail.coordinatorDetail != undefined
            && this.ContactDetail.coordinatorDetail.length > 0) {
            this.coordinatorName = this.ContactDetail.coordinatorDetail[0].coordinatorName;
            this.coordinatorMobileNum = this.ContactDetail.coordinatorDetail[0].coordinatorMobileNum;
        } else {
            this.coordinatorName = '';
            this.coordinatorMobileNum = '';
        }
        this.school = pSchool;
        this.receiptNumber = parseInt(this.school.autoGenerated
            .split("-")[2])
            + (this.date.getFullYear() - 2000);
        this.getPrintDetail();
    }

    getPrintDetail() {
        for (let i = 0; i < this.examList.length; i++) {
            if (this.examList[i].yearOfExam == this.yearOfExam) {

                this.bookSummary = this.examList[i].bookSummary;
                this.BookDetail = this.examList[i].bookSummary.bookDetail;
                this.PaymentDet = this.examList[i].paymentDetail;
                this.rangeArray = new Array(25 - this.BookDetail.length).fill(1);
                this.totalStudents = 0;
                this.totalPaidFees = 0;
                if (this.BookDetail != undefined) {
                    for (var k = 0; k < this.BookDetail.length; k++) {
                        this.totalStudents += this.BookDetail[k].totalStud;
                    }
                }
                if (this.PaymentDet != undefined) {
                    for (var j = 0; j < this.PaymentDet.length; j++) {
                        this.totalPaidFees += this.PaymentDet[j].payAmount;
                    }
                }
            }
        }
    }

    gotoschool(selectedSchool:PartnerSchool){
        this.routeData.params = { 'selectedSchool': selectedSchool };
        this.router.navigate(['/school-index/addschool']);
    }
}