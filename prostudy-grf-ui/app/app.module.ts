import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';


import { StockItemListComponent } from './stock/stockitem.list.component';
import { StockItemAddFormComponent } from './stock/stockitem.add.form.component';

import { AppComponent } from './app.component';

@NgModule( {
    imports: [BrowserModule, FormsModule, MaterialModule.forRoot()],
    declarations: [AppComponent, StockItemListComponent, StockItemAddFormComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }
