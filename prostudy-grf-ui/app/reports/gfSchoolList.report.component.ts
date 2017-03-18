import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { partnerSchoolLevels, IndiaStatesInfo } from '../core/constant.app';
import { PartnerSchool } from '../partnerschool/partner-school';
import { PartnerSchoolService } from '../partnerschool/school.service';

import { RouteData } from '../route-data.provider';

@Component({
    moduleId: module.id,
    selector: 'proerp-schoolList-report',
    templateUrl: './gfSchoolList.report.component.html',
    styleUrls: ['./feature.component.css']
})

export class SchoolListReportCompoent {

    instituteID: number;
    selectFilterData: any;
    temp: any;
    partnerSchoolLevels: string[];
    country: IndiaStatesInfo;
    filteredSchoolList: PartnerSchool[];
    schoolList: PartnerSchool[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private partnerschoolservice: PartnerSchoolService, ) {
        this.instituteID = 5910974510923776;
        this.selectFilterData = {
            category: "All",
            state: "All",
            dist: "All",
            tal: "All"
        }

        this.temp = {
            tempDistricts: [],
            tempTalukas: [],
            tempVillages: []
        }

        this.partnerSchoolLevels = partnerSchoolLevels;
        //this.country = indiaAddressLookupData;
        //this.country = Object.assign({},indiaAddressLookupData);
        this.country.states.unshift({
            name: "All",
            districts: []
        });
    }

    ngOnInit() {
        this.getPartnerSchoolByInstitute();
    }

    filterSchoolList() {
        this.filteredSchoolList = [];
        for (var i = 0; i < this.schoolList.length; i++) {
            if (this.selectFilterData.category != "All") {
                if (this.schoolList[i].category != this.selectFilterData.category) {
                    continue;
                }
            }
            if (this.selectFilterData.state != "All") {
                if (this.selectFilterData.state == this.schoolList[i].address.state) {
                    if (this.selectFilterData.dist == "All") {
                        this.filteredSchoolList
                            .push(this.schoolList[i]);
                    } else if (this.selectFilterData.dist == this.schoolList[i].address.dist) {
                        if (this.selectFilterData.tal == "All") {
                            this.filteredSchoolList
                                .push(this.schoolList[i]);
                        } else if (this.selectFilterData.tal == this.schoolList[i].address.tal) {
                            this.filteredSchoolList
                                .push(this.schoolList[i]);
                        }
                    }
                }
            } else {
                this.filteredSchoolList
                    .push(this.schoolList[i]);
            }
        }
    }

    getPartnerSchoolByInstitute() {
        this.partnerschoolservice.getPartnerByInstitute(this.instituteID).then(list => {
            this.schoolList = list;
        });
    }

    getDistricts(state: string) {
        this.temp.tempDistricts = [];
        for (let i = 0; i < this.country.states.length; i++) {
            if (this.country.states[i].name == state) {
                this.temp.tempDistricts = this.country.states[i].districts;
            }
        }
    }

    getTalukas(district: string) {
        this.temp.tempTalukas = [];
        for (let i = 0; i < this.temp.tempDistricts.length; i++) {
            if (this.temp.tempDistricts[i].name == district) {
                this.temp.tempTalukas = this.temp.tempDistricts[i].talukas;
            }
        }
    }

    getVillages(taluka: string) {
        this.temp.tempVillages = [];
        for (let i = 0; i < this.temp.tempTalukas.length; i++) {
            if (this.temp.tempTalukas[i].name == taluka) {
                this.temp.tempVillages = this.temp.tempTalukas[i].villages;
            }
        }
    }
}