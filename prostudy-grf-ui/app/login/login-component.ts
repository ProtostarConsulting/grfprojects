import { Component, Optional } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { RouteData } from '../route-data.provider';

import { GoogleEndpointService } from '../core/google-endpoint.service';
import { LocalUserService } from '../core/local-user.service';
import { User, UserService } from '../setup/user.service';

@Component({
    moduleId: module.id,
    selector: 'login-component',
    templateUrl: 'login-component.html'
})

export class LoginComponent {

    public tempUser = new User();
    public errorMsg = '';
    public sucessfullyMsg = '';
    currentUser: any;

    constructor(private userservice: UserService,
        private localUserService: LocalUserService,
        private googleApiService: GoogleEndpointService,
        private routeData: RouteData,
        private router: Router) {  }

    login() {
        this.userservice.login(this.tempUser.email_id,
            this.tempUser.password).then(data => {
                if (data.email_id) {
                    this.currentUser = data;
                    this.sucessfullyMsg = "User logged in successfully--" + data.email_id;
                    this.localUserService.setUser(this.currentUser);
                    this.routeData.params = { 'curUser': data };
                    this.router.navigate(['/login-index/privatecomponent']);
                } else {
                    if (!data || data.status != "active") {
                        this.errorMsg = "Login failed. Please try again. If there is any issue, please contact to admin.";
                    }
                }
            });
    }
}