import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';


import { AppComponent } from './app.component';
import { RouteData } from './route-data.provider';

import { PageNotFoundComponent } from './page-not-found.component';

import { ProERPModule } from './proerp/proerp.module';
import { SetupModule } from './setup/setup.module';
import { SchoolModule } from './partnerschool/school.module';
import { GfBookModule } from './gfbook/gfbook.module';

import { ProStudyComponent } from './prostudy/feature.component';

import { AppRoutingModule } from './app-routing.module';
import { ApiConfig } from './core/api.config';
import { GoogleEndpointService } from './core/google-endpoint.service';


@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule.forRoot(), ProERPModule, SetupModule, SchoolModule, GfBookModule, AppRoutingModule],
    declarations: [AppComponent, PageNotFoundComponent, ProStudyComponent],
    bootstrap: [AppComponent],
    providers: [RouteData, ApiConfig, GoogleEndpointService]
})
export class AppModule { }
