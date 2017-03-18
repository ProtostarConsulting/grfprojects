import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { PartnerSchool } from '../partnerschool/partner-school';
import { PartnerSchoolService } from '../partnerschool/school.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-examResultList-report',
    templateUrl: './examResultList.report.component.html',
    styleUrls: ['./feature.component.css']
})

export class ExamResultListReportComponent {

    pendingSchoolList: PartnerSchool[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolservice: PartnerSchoolService) { }

    ngOnInit() {
        this.getPendingExamResultSchool();
    }

    getPendingExamResultSchool() {
        this.partnerschoolservice.getExamResultEntities().then(list => {
            this.pendingSchoolList = list;
        });
    }

    gotoSchool(selectedSchool: PartnerSchool) {
        this.routeData.params = { 'selectedSchool': selectedSchool };
        this.router.navigate(['/school-index/addschool']);
    }

    getRowStyle(even: number): any {
        if (!even) {
            return {
                'border': '1px solid black',
                'text-align': 'left',
                'padding': '2px',
                'background-color': '#8cced4'
            };
        } else {
            return {
                'border': '1px solid black',
                'text-align': 'left',
                'padding': '2px'
            };
        }
    }

    getTHStyle(): any {
        return {
            'border': '1px solid black',
            'text-align': 'center',
            'padding': '5px',
            'background-color': '#44acb6'
        };
    }
}