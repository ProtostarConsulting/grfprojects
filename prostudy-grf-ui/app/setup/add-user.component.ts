import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { RouteData } from '../route-data.provider';
import { UserService, User } from './user.service';


@Component({
    moduleId: module.id,
    selector: 'proerp-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./feature.component.css']
})
export class AddUserComponent implements OnInit {
    id: string;
    user: User;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private userService: UserService
    ) {
        this.user = new User();
    }

    ngOnInit() {
        if (this.routeData.params.selectedUser) {
            this.user = this.routeData.params.selectedUser;
            console.log('this.user.id: ' + this.user.id);
            // Clean the data from routeData 
            this.routeData.params.selectedUser = null;
        }
    }
    saveUser() {
        this.user.role = 'Admin';
        this.user.password = '1';
        this.user.instituteID = '5910974510923776';
        this.userService.saveUser(this.user);
    }

}
