import {Component, Optional, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Router, ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { RouteData } from '../route-data.provider';
import { GFBookStockService, GFBook,GFBookStock } from './gfbook.service';

@Component({
  moduleId: module.id,
  selector: 'proerp-add-gfbookstock',
  templateUrl: './add-gfbookstock.component.html',
  styleUrls: ['./feature.component.css']
})

export class AddGfbookStockComponent {

    tempBookStocks: GFBook[];
    private instituteID: number;
    book:GFBook = new GFBook();
    bookstock:GFBookStock = new GFBookStock();
    
    constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routeData: RouteData,
    private gfbookservice: GFBookStockService
  ) {
      this.instituteID = +this.bookstock.instituteID;
      this.getGFBookByInstituteId();
  }

  ngOnInit() {
        console.log('came to ngOnInit...');
        let noOfTries = 5;
        (function waitTillLoadingEP(me): void {
            if (me.gfbookservice.isLoadingEP() && --noOfTries) {
                console.log('Waiting for Loading EP...every 2 seconds...?');
                setTimeout(function () { waitTillLoadingEP(me) }, 2000);
            } else {
                console.log('Loading EP done!');
                me.getGFBookByInstituteId();
            }
        })(this);
    }

    addGFBookStock(){
        this.bookstock.instituteID = '5910974510923776';
        
    }

  getGFBookByInstituteId():void{
        console.log('Came to ListGfBookComponent:getGFBookByInstituteId');
        this.gfbookservice.getGFBookByInstituteId(this.instituteID).then(list => {
            this.tempBookStocks = list;
            console.log('Came to ListGfBookComponent:bookList:' + this.tempBookStocks);
        });
    }
}