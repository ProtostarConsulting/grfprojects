import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { SetupComponent } from './feature.component';
import { AddUserComponent } from './add-user.component';
import { ListUserComponent } from './list-user.component';
import { SetupRoutingModule } from './setup-routing.module';


@NgModule( {
    imports: [FormsModule, FormsModule, SetupRoutingModule],
    declarations: [SetupComponent, AddUserComponent, ListUserComponent]   
})
export class SetupModule {
}