import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';


import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found.component';

import { ProERPModule } from './proerp/proerp.module';
import { SetupModule } from './setup/setup.module';

import { ProStudyComponent } from './prostudy/feature.component';

import { AppRoutingModule } from './app-routing.module';


@NgModule( {
    imports: [BrowserModule, FormsModule, MaterialModule.forRoot(), ProERPModule, SetupModule, AppRoutingModule],
    declarations: [AppComponent, PageNotFoundComponent, ProStudyComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
