import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdRadioModule } from '@angular/material';

import { GfStudentComponent } from './feature.component';
import { AddStudentPage } from './add-student.page';
import { AddGfStudentComponent } from './add-student.component';
import { ListStudentPage } from './list-student.page';
import { ListStudentComponent } from './list-student.component';
import { AddExamResultPage } from './add-examresult.page';
import { AddExamResultComponent } from './add-examresult.component';
import { ListExamResultPage } from './list-examresult.page';
import { ListExamResultComponent } from './list-examresult.component';
import { PrintExamResultComponent } from './print-examresult.component';
import { PrintExamResultPage } from './print-examresult.page';

import { GfStudentRoutingModule } from './gfStudent-routing.module';
import { GFStudent, GfStudentService } from './gfStudent.service';

@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule, GfStudentRoutingModule, MdRadioModule],
    declarations: [GfStudentComponent, AddStudentPage, AddGfStudentComponent, ListStudentPage, ListStudentComponent, AddExamResultComponent, AddExamResultPage, ListExamResultPage, ListExamResultComponent, PrintExamResultComponent, PrintExamResultPage],
    providers: [GfStudentService]
})

export class GfStudentModule { }