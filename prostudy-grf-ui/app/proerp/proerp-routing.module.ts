import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProERPComponent } from './feature.component';
import { Ch1Component } from './ch1.component';
import { Ch2Component } from './ch2.component';

const proerpRoutes: Routes = [
    {
        path: 'proerp-index', component: ProERPComponent,
        children: [
            { path: 'ch1/:id', component: Ch1Component },
            { path: 'ch1', component: Ch1Component },
            { path: 'ch2', component: Ch2Component },
            { path: '', component: Ch1Component }
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
export class ProERPRoutingModule {}