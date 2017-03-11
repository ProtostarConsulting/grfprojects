import {
    Component, Optional, OnInit, AfterContentInit, ContentChild,
    AfterViewChecked, AfterViewInit, ViewChild, ViewChildren
} from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { RouteData } from '../route-data.provider';

import { GFStudent, GfStudentService } from './gfStudent.service';
import { PartnerSchoolService } from '../partnerschool/school.service';
import { PartnerSchool } from '../partnerschool/partner-school';
import { User, UserService } from '../setup/user.service';
import { standardList, answerOfMediumList } from '../core/constant.app';

@Component({
    moduleId: module.id,
    selector: 'proerp-add-student',
    templateUrl: './add-student.component.html',
    styleUrls: ['./feature.component.css']
})

export class AddGfStudentComponent implements OnInit {

    tempStudent: GFStudent;
    standardList: string[];
    medium: string[];
    schoolList: PartnerSchool[];
    selectedGFStudID: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private gfstudentservice: GfStudentService,
        private partnerschoolService: PartnerSchoolService
    ) {
        this.standardList = standardList;
        this.medium = answerOfMediumList;
        this.schoolList = new Array<PartnerSchool>();
        this.tempStudent = {
            id: '',
            instituteID: 5910974510923776,
            fName: '',
            mName: '',
            lName: '',
            standard: '',
            mediumOfAnswer: '',
            gender: '',
            prn: '',
            school: new PartnerSchool(),
            role: 'Student'
        }
    }

    ngOnInit() {
        if (this.routeData.params.selectedStudent) {
            this.selectedGFStudID = this.routeData.params.selectedStudent;
            this.getGFStudentById(this.selectedGFStudID);
            // Clean the data from routeData 
            this.routeData.params.selectedStudent = null;
        }
        this.getPartnerByInstitute();
    }

    addStudent() {
        if (!this.selectedGFStudID) {
            if (this.schoolList.length == 1) {
                this.tempStudent.school = this.schoolList[0];
            }
            else {
                for (let i = 0; i < this.schoolList.length; i++) {
                    if (this.tempStudent.school.schoolName == this.schoolList[i].schoolName) {
                        this.tempStudent.school = this.schoolList[i];
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this.schoolList.length; i++) {
                if (this.tempStudent.school.schoolName == this.schoolList[i].schoolName) {
                    this.tempStudent.school = this.schoolList[i];
                }
            }
        }
        this.gfstudentservice.addStudent(this.tempStudent).then(studObj => {
            console.log('Saved Student:' + studObj);
            this.tempStudent = studObj;
            if (this.tempStudent.id) {
                this.router.navigate(['/student-index/liststudent']);
            }
        });
    }

    getGFStudentById(id: string) {
        this.gfstudentservice.getGFStudentById(id).then(tempStudent => {
            this.tempStudent = tempStudent;
        });
    }

    getPartnerByInstitute(): void {
        this.partnerschoolService.getPartnerByInstitute(this.tempStudent.instituteID).then(list => {
            this.schoolList = list;
        });
    }
    
    maleChClicked() {
        if (this.tempStudent.gender == '' || this.tempStudent.gender == 'Female') {
            this.tempStudent.gender = 'Male';
        } else {
            this.tempStudent.gender == ''
        }
    }
    femaleChClicked() {
        if (this.tempStudent.gender == '' || this.tempStudent.gender == 'Male') {
            this.tempStudent.gender = 'Female';
        } else {
            this.tempStudent.gender == ''
        }
    }

    gotolist() {
        this.router.navigate(['/student-index/liststudent']);
    }
}