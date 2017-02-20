import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GfBookComponent } from './feature.component';
import { AddGfbookPage } from './add-gfbook.page';
import { ListGfbookPage } from './list-gfbook.page';
import { AddGfBookStockPage } from './add-gfbookstock.page';

const proerpRoutes: Routes = [
    {
        path: 'gfbook-index', component: GfBookComponent,
        children: [
            { path: 'addgfbook/:id', component: AddGfbookPage },
            { path: 'addgfbook', component: AddGfbookPage },
            { path: 'addgfbookstock', component: AddGfBookStockPage },
            { path: 'listgfbook', component: ListGfbookPage },
            { path: '', component: ListGfbookPage }
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
export class GfBookRoutingModule { }