import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';

import { SetupComponent } from './feature.component';
import { AddUserComponent } from './add-user.component';
import { ListUserComponent } from './list-user.component';
import { AddUserPage } from './add-user.page';
import { ListUserPage } from './list-user.page';


import { SetupRoutingModule } from './setup-routing.module';

import { GoogleEndpointService } from './google-endpoint.service';
import { UserService } from './user.service';


@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule, SetupRoutingModule],
    declarations: [SetupComponent, AddUserComponent, ListUserComponent, AddUserPage, ListUserPage],
    providers: [UserService, GoogleEndpointService]
})
export class SetupModule {
}