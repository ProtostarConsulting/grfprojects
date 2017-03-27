import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { RouteData } from '../route-data.provider';
import { PartnerSchool, Address, ExamDetail, ContactDetail, CoordinatorDetail, BookSummary, BookDetail } from '../partnerschool/partner-school';
import { AddSchoolComponent } from '../partnerschool/add-school.component';

import { PartnerSchoolService } from '../partnerschool/school.service';

import { GFBookStockService } from '../gfbook/gfbook.service';

@Component({
    moduleId: module.id,
    selector: 'update-school-withoutlogin',
    templateUrl: 'update_withoutlogin.component.html',
    styleUrls: ['./feature.component.css']
})

export class UpdateSchoolWithoutLogin extends AddSchoolComponent {
    school: PartnerSchool;
    address: Address;
    routeData: RouteData;

    constructor(
        route: ActivatedRoute,
        router: Router,
        routeData: RouteData,
        partnerschoolService: PartnerSchoolService,
        gfbookService: GFBookStockService
    ) {
        super(route, router, routeData, partnerschoolService, gfbookService);
        this.routeData = routeData;
    }
    ngOnInit() {
        if (this.routeData.params.selectedSchool) {
            this.school = this.routeData.params.selectedSchool;
            this.initSchoolLoad(this.school);
            // Clean the data from routeData
            this.routeData.params.selectedSchool = null;
        }
    }
}