import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFeatureComponent } from './feature.component';
import { LoginComponent } from './login-component';
import { PrivateComponent } from './private.component';

const proerpRoutes: Routes = [
    {
        path: 'login-index', component: LoginFeatureComponent,
        children: [
            { path: 'privatecomponent', component: PrivateComponent },
            { path: 'logincomponent', component: LoginComponent },
            { path: '', component: LoginComponent }
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

export class LoginRoutingModule { }