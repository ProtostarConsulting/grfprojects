import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';
import { ProERPComponent } from './proerp/feature.component';
import { ProStudyComponent } from './prostudy/feature.component';
import { SetupComponent } from './setup/feature.component';


const appRoutes: Routes = [
    { path: 'proerp-index', component: ProERPComponent },
    { path: 'prostudy-index', component: ProStudyComponent },
    { path: 'setup-index', component: SetupComponent },
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