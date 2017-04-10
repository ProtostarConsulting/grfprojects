import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule, MdRadioModule } from '@angular/material';

import { LoginFeatureComponent } from './feature.component';
import { LoginComponent } from './login-component';
import { PrivateComponent } from './private.component';

import { LoginRoutingModule } from './login-routing.module';

@NgModule({
    imports: [BrowserModule, FormsModule, MaterialModule, LoginRoutingModule, MdRadioModule],
    declarations: [LoginFeatureComponent, LoginComponent, PrivateComponent]
})

export class LoginModule{

}