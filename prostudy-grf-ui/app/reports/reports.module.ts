import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdRadioModule } from '@angular/material';

import { ReportsComponent } from './feature.component';
import { FinSummaryCompoent } from './fin_summary.component';
import { FinSummaryPage } from './fin_summary.page';
import { DailyDispatchReportCompoent } from './dailydispatchReport.component';
import { DailyDispatchReportPage } from './dailydispatchReport.page';
import { SchoolListReportCompoent } from './gfSchoolList.report.component';
import { SchoolListReportPage } from './gfSchoolList.report.page';
import { ExamResultListReportComponent } from './examResultList.report.component';
import { ExamResultListReportPage } from './examResultList.report.page';

import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule, ReportsRoutingModule, MdRadioModule],
    declarations: [ReportsComponent, FinSummaryCompoent, FinSummaryPage, DailyDispatchReportCompoent, DailyDispatchReportPage, SchoolListReportPage, SchoolListReportCompoent, ExamResultListReportPage, ExamResultListReportComponent],
    providers: []
})

export class ReportsModule { }