import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from '@angular/material';

import { GfBookComponent } from './feature.component';
import { AddGfbookPage } from './add-gfbook.page';
import { AddGfbookComponent } from './add-gfbook.component';
import { ListGfbookPage } from './list-gfbook.page';
import { ListGfBookComponent } from './list-gfbook.component';
import { AddGfBookStockPage } from './add-gfbookstock.page';
import { AddGfbookStockComponent } from './add-gfbookstock.component';
import { ListGfBookStockTransactionComponent } from './list-gfbookStocktransaction.component';
import { ListGfbookStockTransactionPage } from './list-gfbookStocktransaction.page';
import { ViewBookRecordPage } from './view-gfbookRecord.page';
import { ViewBookRecordComponent } from './view-gfbookRecord.component';

import { GfBookRoutingModule } from './gfbook-routing.module';

import { GFBookStockService } from './gfbook.service';


@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule, GfBookRoutingModule],
    declarations: [GfBookComponent, AddGfbookComponent, AddGfbookPage, ListGfbookPage, ListGfBookComponent, AddGfBookStockPage, AddGfbookStockComponent, ListGfbookStockTransactionPage, ListGfBookStockTransactionComponent, ViewBookRecordComponent, ViewBookRecordPage],
    providers: [GFBookStockService]
})

export class GfBookModule {

}