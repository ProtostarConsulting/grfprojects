import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

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
        private partnerschoolService: PartnerSchoolService) {
        this.schoolList = new Array<PartnerSchool>();
        console.log('came to contructor...');
        this.instituteID = this.school.instituteID;
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        let noOfTries = 5;
        (function waitTillLoadingEP(me): void {
            if (me.partnerschoolService.isLoadingEP() && --noOfTries) {
                console.log('Waiting for Loading EP...every 2 seconds...?');
                setTimeout(function () { waitTillLoadingEP(me) }, 2000);
            } else {
                console.log('Loading EP done!');
                me.getPartnerByInstitute();
            }
        })(this);
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
}