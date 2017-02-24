import { Component, Optional } from '@angular/core';

import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { GoogleEndpointService } from './core/google-endpoint.service';

@Component({
    selector: 'my-app',
    templateUrl: './app/app.component.html',
    styleUrls: ['./app/app.component.css']
})
export class AppComponent {
    selectedProduct: string;
    constructor(private googleApiService: GoogleEndpointService) {
        console.log('Calling initialize api....');
        googleApiService.getClient();
        console.log('Calling initialize api....Done');
    }
    selectProduct(product: string) {
        this.selectedProduct = product;
    }
}
