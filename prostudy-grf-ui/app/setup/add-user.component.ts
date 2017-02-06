import { Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { UserService, User } from './user.service';


@Component({
    moduleId: module.id,
    selector: 'proerp-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./feature.component.css']
})
export class AddUserComponent implements OnInit {
    id: string;
    user: User = new User();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {
        this.user = new User();
     }

    ngOnInit() {
        this.route.params.switchMap((params: Params) => (params['id'])).subscribe((id: string) => {
            this.id = id;
            console.log('this.id: ' + this.id)
        });
    }
    saveUser() {
        this.user.role = 'Admin';
        this.user.password = '1';
        this.user.instituteID = '5910974510923776';
        this.userService.saveUser(this.user);
    }

}
