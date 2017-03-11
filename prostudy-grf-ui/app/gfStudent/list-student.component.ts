import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

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
        private gfstudentservice: GfStudentService) {
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

    gotoEditStudent(selectedStudent: string) {
        this.routeData.params = { 'selectedStudent': selectedStudent };
        this.router.navigate(['/student-index/addstudent']);
    }
}