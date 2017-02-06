import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SetupComponent } from './feature.component';
import { AddUserPage } from './add-user.page';
import { ListUserPage } from './list-user.page';

const proerpRoutes: Routes = [
    {
        path: 'setup-index', component: SetupComponent,
        children: [
            { path: 'user/:id', component: AddUserPage },
            { path: 'user', component: AddUserPage },
            { path: 'listuser', component: ListUserPage },
            { path: '', component: ListUserPage }
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
export class SetupRoutingModule { }