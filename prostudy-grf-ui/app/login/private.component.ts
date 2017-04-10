import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RouteData } from '../route-data.provider';
import { LocalUserService } from '../core/local-user.service';

@Component({
    selector: 'login-form',
    template: `
            <div class="container" >
                <div class="content">
                    <span>Congratulations, you have successfully logged in!!</span><br>
                    <span>Got user using local service, Email ID : {{curUser.email_id}}</span>
                    <br />
                    <a (click)="logout()" href="#">Click Here to logout</a>
                </div>
            </div>
    	`
})

export class PrivateComponent {

    curUser: any;
    constructor(private router: Router,
        private routeData: RouteData) { }

    ngOnInit() {
        if (this.routeData.params.curUser) {
            this.curUser = this.routeData.params.curUser;
        }
        this.routeData.params.curUser = null;
    }

    logout() {
        this.router.navigate(['/login-index/logincomponent']);
    }
}