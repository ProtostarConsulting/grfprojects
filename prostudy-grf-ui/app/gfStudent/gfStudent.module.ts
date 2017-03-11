import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdRadioModule } from '@angular/material';

import { GfStudentComponent } from './feature.component';
import { AddStudentPage } from './add-student.page';
import { AddGfStudentComponent } from './add-student.component';
import { ListStudentPage } from './list-student.page';
import { ListStudentComponent } from './list-student.component';

import { GfStudentRoutingModule } from './gfStudent-routing.module';
import { GFStudent, GfStudentService } from './gfStudent.service';

@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule, GfStudentRoutingModule, MdRadioModule],
    declarations: [GfStudentComponent, AddStudentPage, AddGfStudentComponent, ListStudentPage, ListStudentComponent],
    providers: [GfStudentService]
})

export class GfStudentModule { }