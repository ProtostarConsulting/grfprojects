import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Http, RequestOptions, URLSearchParams, ResponseContentType } from '@angular/http';

import { GoogleEndpointService } from '../core/google-endpoint.service';
import { GfStudentService, GFStudent } from './gfStudent.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-list-student',
    templateUrl: 'list-student.component.html',
    styleUrls: ['./feature.component.css']
})

export class ListStudentComponent {

    studentList: GFStudent[];
    courier: GFStudent = new GFStudent();
    instituteID: number = 5910974510923776;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private gfstudentservice: GfStudentService,
        private http: Http) {
        this.studentList = new Array<GFStudent>();
    }

    ngOnInit() {
        this.getGFStudentsByInstitute();
    }

    getGFStudentsByInstitute(): void {
        this.gfstudentservice.getGFStudentsByInstitute(this.instituteID).then(list => {
            this.studentList = list;
        });
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

    gotoEditStudent(selectedStudent: string) {
        this.routeData.params = { 'selectedStudent': selectedStudent };
        this.router.navigate(['/student-index/addstudent']);
    }

    downloadcertificate(id: string) {
        let params = new URLSearchParams();
        params.set('id', id);
        return this.http.get('http://localhost:8888/PrintCertificatePdf', { search: params, responseType: ResponseContentType.Blob })
            .toPromise()
            .then((response) => {
                let headers = response.headers;
                console.log("headers: " + headers);
                let data1 = response.blob();
                let saveAs = require('file-saver');
                let blob = new Blob([data1], { type: 'application/pdf' });
                saveAs(blob, "Certificate" + new Date().toLocaleDateString() + ".pdf");
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