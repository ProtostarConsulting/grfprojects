import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsComponent } from './feature.component';
import { FinSummaryPage } from './fin_summary.page';
import { DailyDispatchReportPage } from './dailydispatchReport.page';
import { SchoolListReportPage } from './gfSchoolList.report.page';
import { ExamResultListReportPage } from './examResultList.report.page';

const proerpRoutes: Routes = [
    {
        path: 'reports-index', component: ReportsComponent,
        children: [
            { path: 'fin_Summary', component: FinSummaryPage },
            { path: 'dispatchReport', component: DailyDispatchReportPage },
            { path: 'schooListReport', component: SchoolListReportPage },
            { path: 'examResultReport', component: ExamResultListReportPage },
            { path: '', component: FinSummaryPage }
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

export class ReportsRoutingModule { }