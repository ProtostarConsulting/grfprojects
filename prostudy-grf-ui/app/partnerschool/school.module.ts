import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdRadioModule } from '@angular/material';

import { SchoolComponent } from './feature.component';
import { AddSchoolComponent } from './add-school.component';
import { ListSchoolComponent } from './list-school.component';
import { PrintBookDetailsComponent } from './print-bookdetails.component';
import { PrintAddressComponent } from './print-address.component';
import { AddSchoolPage } from './add-school.page';
import { ListSchoolPage } from './list-school.page';
import { PrintBookDetailsPage } from './print-bookdetails.page';
import { PrintAddressPage } from './print-address.page';

import { SchoolRoutingModule } from './school-routing.module';

import { PartnerSchoolService } from './school.service';

@NgModule({
    imports:[BrowserModule, FormsModule, MaterialModule, SchoolRoutingModule, MdRadioModule],
    declarations:[SchoolComponent, AddSchoolComponent,ListSchoolComponent,PrintBookDetailsComponent,PrintAddressComponent,AddSchoolPage,ListSchoolPage,PrintBookDetailsPage,PrintAddressPage],
    providers:[PartnerSchoolService]
})
export class SchoolModule {
    
}