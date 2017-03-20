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
    school: PartnerSchool = new PartnerSchool();

    constructor(private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolService: PartnerSchoolService,
        private http: Http) {
        this.schoolList = new Array<PartnerSchool>();
        console.log('came to contructor...');
        this.instituteID = this.school.instituteID;
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        this.getPartnerByInstitute();
    }

    goToSchool(selectedSchool: PartnerSchool) {
        this.routeData.params = { 'selectedSchool': selectedSchool };
        this.router.navigate(['/school-index/addschool']);
    }

    getPartnerByInstitute(): void {
        console.log('Came to ListSchoolComponent:getPartnerByInstitute');
        this.partnerschoolService.getPartnerByInstitute(this.instituteID).then(list => {
            this.schoolList = list;
            console.log('Came to ListSchoolComponent:schoolList:' + this.schoolList);
        });
    }

    downloadData(){
   
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
                saveAs(blob, "SchoolData_"+new Date().toLocaleDateString()+".csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch(this.handleError);
    }

  downloadDataByLanguage(){
   
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
                saveAs(blob, "SchoolDataByLanguage_"+new Date().toLocaleDateString()+".csv");
                let url = window.URL.createObjectURL(blob);
                window.open(url);
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}