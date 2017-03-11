import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdRadioModule } from '@angular/material';

import { CouriersComponent } from './feature.component';
import { AddCourierComponent } from './add-courier.component';
import { AddCourierPage } from './add-courier.page';
import { ListCourierComponent } from './list-couriers.component';
import { ListCourierPage } from './list-couries.page';
import { SearchCourierPage } from './search-courier.page';
import { SearchCourierComponent } from './search-courier.component';
import { ViewCourierComponent } from './view-couriers.component';
import { ViewCourierPage } from './view-couriers.page';
import { AddCourierFromPSComponent } from './gfCourier_directAddFromPS';
import { AddCourierFromPSPage } from './gfCourier_directAddFromPS.page';
import { Dialog1 } from './gfCourier_directAddFromPS';

import { CourierSerivces, GFCourier } from './courier.service';
import { CourierRoutingModule } from './courier-routing.module';

@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule, CourierRoutingModule, MdRadioModule],
    declarations: [CouriersComponent, AddCourierComponent, AddCourierPage, ListCourierPage, ListCourierComponent, SearchCourierPage, SearchCourierComponent, ViewCourierComponent, ViewCourierPage, AddCourierFromPSPage, AddCourierFromPSComponent, Dialog1],
    entryComponents: [Dialog1],
    providers: [CourierSerivces]
})
export class CouriersModule {

}