import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { RouteData } from '../route-data.provider';
import { PartnerSchool, Address, ExamDetail, ContactDetail, CoordinatorDetail, BookSummary, BookDetail } from '../partnerschool/partner-school';
import { PrintBookDetailsComponent } from '../partnerschool/print-bookdetails.component';

import { PartnerSchoolService } from '../partnerschool/school.service';

import { GFBookStockService } from '../gfbook/gfbook.service';

@Component({
    moduleId: module.id,
    selector: 'proerp-print-examresult',
    templateUrl: 'print-examresult.component.html',
    styleUrls: ['./feature.component.css']
})

export class PrintExamResultComponent {
    schoolList: PartnerSchool[];
    yearOfExam: string;
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
    examDetail: ExamDetail;
    totalStudents: number;
    numberOfCoordinators: number;
    curyear1: string;
    rangeArray: number[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolService: PartnerSchoolService
    ) {
        this.getCurYear();
    }

    ngOnInit() {
        if (this.routeData.params.selectedSchool) {
            this.school = this.routeData.params.selectedSchool;
            this.initBookDetails(this.school);
            // Clean the data from routeData
            this.routeData.params.selectedSchool = null;
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
                this.examDetail = this.examList[i];
                this.bookSummary = this.examList[i].bookSummary;
                this.BookDetail = this.examList[i].bookSummary.bookDetail;
                this.rangeArray = new Array(25 - this.BookDetail.length).fill(1);
                this.totalStudents = 0;
                if (this.BookDetail != undefined) {
                    for (var k = 0; k < this.BookDetail.length; k++) {
                        this.totalStudents += this.BookDetail[k].appearedTotalStud;
                    }
                }
            }
        }
    }

    printBookDetailDiv(bookDetailDiv: any) {
        window.frames["print_frame"].document.body.innerHTML = document.getElementById(bookDetailDiv).innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
    }

    gotoexamresultlist(){
        this.router.navigate(['/student-index/listexamresult']);
    }
}