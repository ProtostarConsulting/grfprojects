import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';

import { PartnerSchoolService } from './school.service';
import { PartnerSchool } from './partner-school';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-list-school',
    templateUrl: 'list-school.component.html',
    styleUrls: ['./feature.component.css']
})

export class ListSchoolComponent {
    schoolList: PartnerSchool[];
    private instituteID: number;
    isLoggedIn: boolean;
    query: any;
    school: PartnerSchool[];

    constructor(private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolService: PartnerSchoolService,
        private http: Http) {
        this.schoolList = new Array<PartnerSchool>();
        console.log('came to contructor...');
        this.instituteID = 5910974510923776;
        this.query = {
            limit: 60,
            limitOptions: [1000, 2000, 3000, 4000, 5000],
            page: 1,
            totalSize: 0,
            totalSizeBackup: 0,
            searchByGrfRegNo: '',
            searchSchoolTxt: '',
            selectedYearOfExam: '',
            entityList: null
        };
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        this.isLoggedIn = false;
        this.getPartnerByInstitute();
    }

    searchSchoolTxtChange() {
        if (this.query.searchSchoolTxt
            && this.query.searchSchoolTxt.length >= 3) {
            console.log("input string ****" + this.query.searchSchoolTxt);
            this.query.searchByGrfRegNo = "";
            this.query.page = 1;
            this
                .schoolSerachTxtChange(this.query.searchSchoolTxt
                    .trim());
        } else {
            // let user type whole 12 chars of GRF No
            // restore this.schools if was filtered
            if (this.school.length !== this.schoolList.length) {
                this.query.page = 1;
                this.school = this.schoolList;
                this.query.totalSize = this.query.totalSizeBackup;
            }
        }
    }


    searchByGrfRegNoChange() {
        let enteredGrfRegNo = this.query.searchByGrfRegNo
            .trim();
        if (enteredGrfRegNo && enteredGrfRegNo.length >= 5) {
            this.query.searchSchoolTxt = "";
            this.query.page = 1;
            let grfRegNo = (enteredGrfRegNo
                .startsWith('P-2017-') && enteredGrfRegNo.length >= 12) ? enteredGrfRegNo
                : 'P-2017-' + enteredGrfRegNo;

            this.grfRegNoChange(grfRegNo);
        } else {
            // let user type whole 5 chars of GRF No
            // restore this.schools if was filtered
            if (this.school.length !== this.schoolList.length) {
                this.query.page = 1;
                this.school = this.schoolList;
                this.query.totalSize = this.query.totalSizeBackup;
            }
        }
    }

    selfUpdateChkClicked(chkValue: boolean) {
        if (chkValue) {
            this.pendingschoolSelfUpdateList();
        } else {
            this.getPartnerByInstitute();
        }
    }

    schoolSerachTxtChange(searchSchoolTxt: string) {

        this.query.searchTextDone = true;
        this.schoolList = [];
        console.log("Fetcing searchSchoolTxt: "
            + searchSchoolTxt);
        this.partnerschoolService.searchSchoolByName(searchSchoolTxt).then(resp => {
            if (resp) {
                this.schoolList = this.schoolList
                    .concat(resp);
            }
            this.query.searchTextDone = false;
        }
        );
    }

    pendingschoolSelfUpdateList() {
        this.partnerschoolService.getSchoolByselfUpdateStatus().then(list => {
            this.schoolList = list;
        });
    }

    grfRegNoChange(grfRegNo: string) {
        this.query.searchTextDone = true;
        this.schoolList = [];
        console.log("Fetcing GRF No: " + grfRegNo);
        this.partnerschoolService.getInstituteByGRFNo(grfRegNo).then(resp => {
            if (resp.id) {
                this.schoolList.push(resp);
                this.query.totalSize = this.schoolList.length;
            } else {
                this.query.totalSize = 0;
            }

            this.query.searchTextDone = false;
        });
    }

    getPartnerByInstitute(): void {
        console.log('Came to ListSchoolComponent:getPartnerByInstitute');
        this.partnerschoolService.getPartnerByInstitute(this.instituteID).then(list => {
            this.schoolList = list;
            console.log('Came to ListSchoolComponent:schoolList:' + this.schoolList);
        });
    }

    downloadData() {

        let params = new URLSearchParams();
        params.set('InstituteId', this.instituteID.toString());
        return this.http.get('http://localhost:8888/DownloadPartnerSchools', { search: params })
            .toPromise()
            .then((response: any) => {
                let headers = response.headers;
                console.log("headers: " + headers);
                let data1 = response._body;
                let saveAs = require('file-saver');
                let blob = new Blob([data1], { type: 'application/csv;charset=utf-8' });
                saveAs(blob, "SchoolData_" + new Date().toLocaleDateString() + ".csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch(this.handleError);
    }

    downloadDataByLanguage() {

        let params = new URLSearchParams();
        params.set('InstituteId', this.instituteID.toString());
        return this.http.get('http://localhost:8888/DownloadSchoolByLanguage', { search: params })
            .toPromise()
            .then((response: any) => {
                let headers = response.headers;
                console.log("headers: " + headers);
                let data1 = response._body;
                let saveAs = require('file-saver');
                let blob = new Blob([data1], { type: 'application/csv;charset=utf-8' });
                saveAs(blob, "SchoolDataByLanguage_" + new Date().toLocaleDateString() + ".csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

     goToSchool(selectedSchool: PartnerSchool) {
        this.routeData.params = { 'selectedSchool': selectedSchool, 'isLoggedIn': this.isLoggedIn };
        this.router.navigate(['/school-index/addschool']);
    }

    gotoaddschooluser(selectedPSchool: PartnerSchool){
        this.routeData.params = { 'selectedPSchool': selectedPSchool };
        this.router.navigate(['/setup-index/user']);
    }
}