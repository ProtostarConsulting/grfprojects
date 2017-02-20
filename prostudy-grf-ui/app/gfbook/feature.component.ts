import { Component, Optional } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'proerp-help-index',
    templateUrl: './feature.component.html',
    styleUrls: ['./feature.component.css']
})

export class GfBookComponent {
    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    goToAddGfBook(){
        this.router.navigate(['/gfbook-index/addgfbook', 15]);
    }
}