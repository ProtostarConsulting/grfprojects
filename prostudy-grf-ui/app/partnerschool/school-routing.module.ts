import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SchoolComponent } from './feature.component';
import { AddSchoolPage } from './add-school.page';
import { ListSchoolPage } from './list-school.page';
import { PrintBookDetailsPage } from './print-bookdetails.page';
import { PrintAddressPage } from './print-address.page';

const proerpRoutes: Routes = [
    {
        path: 'school-index', component: SchoolComponent,
        children: [
            { path: 'addschool/:id', component: AddSchoolPage },
            { path: 'addschool', component: AddSchoolPage },
            { path: 'listschool', component: ListSchoolPage },
            { path: 'printbookdetails', component: PrintBookDetailsPage },
            { path: 'printaddress', component: PrintAddressPage },
            { path: '', component: ListSchoolPage }
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
export class SchoolRoutingModule { }
