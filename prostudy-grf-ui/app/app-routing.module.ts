import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { ProERPComponent } from './proerp/feature.component';
import { ProStudyComponent } from './prostudy/feature.component';
import { SetupComponent } from './setup/feature.component';
import { SchoolComponent } from './partnerschool/feature.component';
import { GfBookComponent } from './gfbook/feature.component';
import { CouriersComponent } from './couriers/feature.component';
 

const appRoutes: Routes = [
    { path: 'proerp-index', component: ProERPComponent },
    { path: 'prostudy-index', component: ProStudyComponent },
    { path: 'setup-index', component: SetupComponent },
    { path: 'school-index', component: SchoolComponent },
    { path: 'gfbook-index', component: GfBookComponent },
    { path: 'courier-index', component: CouriersComponent },
    { path: '', component: ProStudyComponent, pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule( {
    imports: [
        RouterModule.forRoot( appRoutes )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}