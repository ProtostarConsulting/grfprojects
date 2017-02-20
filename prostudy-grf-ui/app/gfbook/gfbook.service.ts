import { Injectable } from '@angular/core';

import { GoogleEndpointService } from './google-endpoint.service';

export class GFBook {
  id: string;
  instituteID: string = '5910974510923776';
  bookName: string;
  bookAuther: string;
  weight: number;
  bookPrice: number;
  bookQty: number;
  bookMedium: string;
  bookPublication: string;
  bookThreshold: number;
  bookFeedDate: Date = new Date();
  standard: string;
}

export class GFBookStock {
  id: string;
  bookQty: number;
  feedStockDate: Date = new Date();
  instituteID: string = '5910974510923776';
  book: GFBook = new GFBook();
}

@Injectable()
export class GFBookStockService {

  private gapi: any;
  private loadingEP: boolean = true;
  constructor(private googleApiService: GoogleEndpointService) {
    if (this.loadingEP) {
      googleApiService.GetClient().then((gapi: any) => {
        this.gapi = gapi;
        this.loadingEP = false;
      });
    }
  }

  public isLoadingEP(): boolean {
    return this.loadingEP;
  }

  public addbook(book: GFBook): boolean {
    this.gapi.client.gfBookStockService.addGFBook(book).execute((data: any) => {
      console.log('data:' + data);
    });
    return true;
  }

  public getGFBookByInstituteId(instituteID: number): Promise<GFBook[]> {
    console.log('Came to partnerSchoolService:getGFBookByInstituteId');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.gapi.client.gfBookStockService.getGFBookByInstituteId({ 'instituteID': instituteID }).execute((data: any) => {
        console.log('data.items:' + data.items);
        resolve(data.items);
      });
    });
    //Second way ??
  }
}