import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdRadioModule } from '@angular/material';

import { SchoolComponent } from './feature.component';
import { AddSchoolComponent } from './add-school.component';
import { ListSchoolComponent } from './list-school.component';
import { AddSchoolPage } from './add-school.page';
import { ListSchoolPage } from './list-school.page';

import { SchoolRoutingModule } from './school-routing.module';

import { PartnerSchoolService } from './school.service';
import { GoogleEndpointService } from './google-endpoint.service';

@NgModule({
    imports:[BrowserModule, FormsModule, MaterialModule, SchoolRoutingModule, MdRadioModule],
    declarations:[SchoolComponent,AddSchoolComponent,ListSchoolComponent,AddSchoolPage,ListSchoolPage],
    providers:[PartnerSchoolService, GoogleEndpointService]
})
export class SchoolModule {
    
}