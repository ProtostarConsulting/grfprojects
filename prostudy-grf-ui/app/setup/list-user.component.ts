import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { UserService, User } from './user.service';
import { RouteData } from '../route-data.provider';


@Component({
    moduleId: module.id,
    selector: 'proerp-list-user',
    templateUrl: './list-user.component.html',
    styleUrls: ['./feature.component.css']
})
export class ListUserComponent {
    userList: User[];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private routeData: RouteData,
        private userService: UserService
    ) {
        this.userList = new Array<User>();
        console.log('came to contructor...');
    }

    ngOnInit() {
        console.log('came to ngOnInit...');
        let noOfTries = 5;
        (function waitTillLoadingEP(me): void {
            if (me.userService.isLoadingEP() && --noOfTries) {
                console.log('Waiting for Loading EP...every 2 seconds...?');
                setTimeout(function () { waitTillLoadingEP(me); }, 2000);
            } else {
                console.log('Loading EP done!');
                me.getUserList();
            }
        })(this);
    }

    goToUser(selectedUser: User): void {
        this.routeData.params = {'selectedUser' : selectedUser};
        this.router.navigate(['/setup-index/user']);
    }

    getUserList(): void {
        console.log('Came to ListUserComponent:getUserList');
        this.userService.getUserList().then(list => {
            this.userList = list;
            console.log('Came to ListUserComponent:userList:' + this.userList);
        });
    }
}

