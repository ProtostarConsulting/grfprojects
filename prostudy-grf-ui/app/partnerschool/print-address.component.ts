import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { PartnerSchoolService } from './school.service';
import { PartnerSchool, ContactDetail, Address, ExamDetail, BookSummary, BookDetail, PaymentDetail } from './partner-school';
import { GFBookStockService, GFBook } from '../gfbook/gfbook.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-print-address',
    templateUrl: 'print-address.component.html',
    styleUrls: ['./feature.component.css']
})

export class PrintAddressComponent {

    yearOfExam: string;
    school: PartnerSchool = new PartnerSchool();
    examList: Array<ExamDetail>;
    ContactDetail: ContactDetail = new ContactDetail();
    add: Address = new Address();
    coordinatorName: string;
    coordinatorMobileNum: string;
    bookSummary: BookSummary = new BookSummary();
    BookDetail: BookDetail[];
    PaymentDet: PaymentDetail[];
    totalStudents: number;

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
        this.getPrintDetail();
    }

    getPrintDetail() {
        for (let i = 0; i < this.examList.length; i++) {
            if (this.examList[i].yearOfExam == this.yearOfExam) {

                this.bookSummary = this.examList[i].bookSummary;
                this.BookDetail = this.examList[i].bookSummary.bookDetail;
                this.PaymentDet = this.examList[i].paymentDetail;
                this.totalStudents = 0;
                if (this.BookDetail != undefined) {
                    for (var k = 0; k < this.BookDetail.length; k++) {
                        this.totalStudents += this.BookDetail[k].totalStud;
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