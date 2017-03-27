import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExamDetailComponent } from './feature.component';
import { AddExamDetailPage } from './add-examdetails.page';
import { UpdateSchoolWithoutLogin } from './update_withoutlogin.page';

const proerpRoutes: Routes = [
    {
        path: 'examdetail-index', component: ExamDetailComponent,
        children: [
            { path: 'addExamDetails', component: AddExamDetailPage },
            { path: 'updateSchool_withoutlogin', component: UpdateSchoolWithoutLogin },
            { path: '', component: AddExamDetailPage }
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

export class ExamDetailRoutingModule { }