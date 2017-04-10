import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { RouteData } from '../route-data.provider';
import { UserService, User } from './user.service';
import { standardList } from '../core/constant.app';
import { PartnerSchool } from '../partnerschool/partner-school';

@Component({
    moduleId: module.id,
    selector: 'proerp-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./feature.component.css']
})
export class AddUserComponent implements OnInit {
    id: string;
    user: User;
    role: string[];
    standard: string[];
    currentUser: User;
    school: PartnerSchool;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private userService: UserService
    ) {
        this.user = new User();
        this.role = ["Admin", "Student", "Teacher"];
        this.standard = standardList;
    }

    ngOnInit() {
        if (this.routeData.params.selectedUser) {
            this.user = this.routeData.params.selectedUser;
            // Clean the data from routeData 
            this.routeData.params.selectedUser = null;
        }
        if(this.routeData.params.selectedPSchool){
            this.school = this.routeData.params.selectedPSchool;
            this.routeData.params.selectedPSchool = null;
        }
    }

    isGoogleUSerClicked() {
        if (this.user.isGoogleUser) {
            this.user.isGoogleUser = true;
        } else {
            this.user.isGoogleUser = false;
        }
    }

    saveUser() {
        this.user.instituteID = '5910974510923776';
        this.user.school = this.school;
        this.userService.saveUser(this.user).then(userObj => {
            this.currentUser = userObj;
            if (this.currentUser.id) {
                this.router.navigate(['/setup-index/listuser']);
            }
        });
    }

    gotouserlist(){
        this.router.navigate(['/setup-index/listuser']);
    }
}
