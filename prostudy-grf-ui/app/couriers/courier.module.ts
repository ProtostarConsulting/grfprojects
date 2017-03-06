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

import { CourierSerivces,GFCourier } from './courier.service';
import { CourierRoutingModule } from './courier-routing.module';

@NgModule({
    imports:[BrowserModule, FormsModule, MaterialModule, CourierRoutingModule, MdRadioModule],
    declarations:[CouriersComponent,AddCourierComponent,AddCourierPage,ListCourierPage,ListCourierComponent,SearchCourierPage,SearchCourierComponent],
    providers:[CourierSerivces]
})
export class CouriersModule {
    
}