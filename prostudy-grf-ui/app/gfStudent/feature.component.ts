import { Component, Optional } from '@angular/core';
import {MdDialog, MdDialogRef, MdSnackBar} from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'proerp-help-index',
    templateUrl: './feature.component.html',
    styleUrls: ['./feature.component.css']
})

export class GfStudentComponent {
    constructor(
            private route: ActivatedRoute,
            private router: Router
        ) {
            console.log("Inside GFStudent Module");
         }

     goToaddstudent(){
        this.router.navigate(['/student-index/addstudent']);
    }   
}