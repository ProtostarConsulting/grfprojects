import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { ProERPComponent } from './feature.component';
import { Ch1Component } from './ch1.component';
import { Ch2Component } from './ch2.component';
import { ProERPRoutingModule } from './proerp-routing.module';


@NgModule( {
    imports: [FormsModule, FormsModule, ProERPRoutingModule],
    declarations: [ProERPComponent, Ch1Component, Ch2Component]   
})
export class ProERPModule {
}