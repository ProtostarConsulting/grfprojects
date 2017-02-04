import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SetupComponent } from './feature.component';
import { AddUserComponent } from './add-user.component';
import { ListUserComponent } from './list-user.component';

const proerpRoutes: Routes = [
    {
        path: 'setup-index', component: SetupComponent,
        children: [
            { path: 'ch1/:id', component: AddUserComponent },
            { path: 'ch1', component: AddUserComponent },
            { path: 'ch2', component: ListUserComponent },
            { path: '', component: ListUserComponent }
        ]
    },


];

@NgModule( {
    imports: [
        RouterModule.forChild( proerpRoutes )
    ],
    exports: [
        RouterModule
    ]
})
export class SetupRoutingModule {}