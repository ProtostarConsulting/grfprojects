import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CouriersComponent } from './feature.component';
import { AddCourierPage } from './add-courier.page';
import { ListCourierPage } from './list-couries.page';
import { SearchCourierPage } from './search-courier.page';
import { ViewCourierPage } from './view-couriers.page';
import { AddCourierFromPSPage } from './gfCourier_directAddFromPS.page';

const proerpRoutes: Routes = [
    {
        path: 'courier-index', component: CouriersComponent,
        children: [
            { path:'addCourierFromPS', component:AddCourierFromPSPage},
            { path: 'addCourier', component: AddCourierPage },
            { path: 'listcourier', component: ListCourierPage },
            { path:'searchcourier', component:SearchCourierPage},
            { path:'viewcourier', component:ViewCourierPage},
            { path: '', component: ListCourierPage }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(proerpRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class CourierRoutingModule { }