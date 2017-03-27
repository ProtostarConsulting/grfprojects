import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdRadioModule } from '@angular/material';

import { ExamDetailComponent } from './feature.component';
import { AddExamDetailComponent } from './add-examdetail.component';
import { AddExamDetailPage } from './add-examdetails.page';
import { UpdateSchoolWithoutLogin } from './update_withoutlogin.page';

import { ExamDetailRoutingModule } from './examdetails-routing.module';

@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule, MdRadioModule, ExamDetailRoutingModule],
    declarations: [ExamDetailComponent, AddExamDetailComponent, AddExamDetailPage, UpdateSchoolWithoutLogin],
    providers: []
})

export class ExamDetailModule { }