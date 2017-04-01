import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import { GfStudentService } from '../gfStudent/gfStudent.service';
import { ExamResult, ExamResultList } from './examresult';
import { GoogleEndpointService } from '../core/google-endpoint.service';
import { PartnerSchool } from '../partnerschool/partner-school';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-list-examresult',
    templateUrl: 'list-examresult.component.html',
    styleUrls: ['./feature.component.css']
})

export class ListExamResultComponent {

    instituteID: number = 5910974510923776;
    examResultList: ExamResult[];
    examResultListBackup: ExamResult[];
    grfReviewed: boolean;
    pendingResults: boolean;
    list:any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private gfstudentservice: GfStudentService,
        private http: Http) {
        this.examResultList = new Array<ExamResult>();
        this.grfReviewed = false;
        this.pendingResults = false;
    }

    ngOnInit() {
        this.getExamResultEntities();
        console.log("inside list exam Result");
    }

    getExamResultEntities() {
        this.gfstudentservice.getExamResultEntities(this.instituteID).then(list => {
            this.examResultList = list;
            this.examResultListBackup = this.examResultList;
        });
    }

    pendingGrfReview() {
        if (!this.grfReviewed) {
            this.getExamResultsPendingGRFReview();
        } else {
            if (this.examResultList.length != this.examResultListBackup.length) {
                this.examResultList = this.examResultListBackup;
            }
        }
    }

    pendingResultsList() {
        if (!this.pendingResults) {
            this.fetchExamResultPendingByPaging();
        } else {
            this.refreshListPage();
            this.pendingResults = true;
        }
    }

    fetchExamResultPendingByPaging() {
        /**this.gfstudentservice.fetchExamResultPendingByPaging(this.instituteID).then(list => {
            this.examResultList = list;
        });*/
    }

    getExamResultsPendingGRFReview() {
        this.gfstudentservice.getExamResultsPendingGRFReview(this.instituteID).then(list => {
            this.examResultList = list;
        });
    }

    refreshListPage(){

    }

    downloadData() {
        let params = new URLSearchParams();
        params.set('InstituteId', this.instituteID.toString());
        return this.http.get('http://localhost:8888/DownloadGFStudents', { search: params })
            .toPromise()
            .then((response: any) => {
                let headers = response.headers;
                console.log("headers: " + headers);
                let data1 = response._body;
                let saveAs = require('file-saver');
                let blob = new Blob([data1], { type: 'application/csv;charset=utf-8' });
                saveAs(blob, "GFStudentData_" + new Date().toLocaleDateString() + ".csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    gotoReviewExamResult(reviewByGrfRegNo: string) {
        this.routeData.params = { 'reviewByGrfRegNo': reviewByGrfRegNo };
        this.router.navigate(['/student-index/addexamresult']);
    }

    gotoprintExamResult(selectedSchool: PartnerSchool) {
        this.routeData.params = { 'selectedSchool': selectedSchool };
        this.router.navigate(['/student-index/printexamresult']);
    }
}