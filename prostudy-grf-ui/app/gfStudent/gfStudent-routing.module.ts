import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GfStudentComponent } from './feature.component';
import { AddStudentPage } from './add-student.page';
import { ListStudentPage } from './list-student.page';

const proerpRoutes: Routes = [
    {
        path: 'student-index', component: GfStudentComponent,
        children: [
            { path: 'addstudent', component: AddStudentPage },
            { path: 'liststudent', component: ListStudentPage },
            { path: '', component: ListStudentPage }
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

export class GfStudentRoutingModule { }