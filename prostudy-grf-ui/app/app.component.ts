import { Component, Optional } from '@angular/core';


import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';

@Component({
    selector: 'my-app',
    templateUrl: './app/app.component.html',
    styleUrls: ['./app/app.component.css']
})
export class AppComponent {
    selectedProduct: string;

 selectProduct(product: string){
     this.selectedProduct = product;
 }
}
