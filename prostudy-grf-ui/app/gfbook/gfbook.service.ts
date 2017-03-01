import { Injectable } from '@angular/core';

import { GoogleEndpointService } from '../core/google-endpoint.service';

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
  bookQty: number;
  feedStockDate: Date = new Date();
  instituteID: string = '5910974510923776';
  book: GFBook = new GFBook();
}

export class GFBookTransaction {
  transactionType: string;
  transactionDate: Date = new Date();
  instituteID: string = '5910974510923776';
  bookQty: number;
  book: GFBook;
}

@Injectable()
export class GFBookStockService {

  private gapi: any;
  constructor(private googleApiService: GoogleEndpointService) {
    this.gapi = googleApiService.getClient();
  }

  public addbook(book: GFBook): Promise<GFBook> {
    return new Promise(resolve => {
      this.googleApiService.getGAPI().client.gfBookStockService.addGFBook(book).execute((data: GFBook) => {
        resolve(data);
        console.log('data:' + data);
      });
    });
  }

  public addGFBookStock(bookStockEntry: GFBookStock): boolean {
    console.log('inside addGFBookStock');
    this.googleApiService.getGAPI().client.gfBookStockService.addGFBookStock(bookStockEntry).execute((data: any) => {
      console.log('data:' + data);
    });
    return true;
  }

  public addTranAfterAddBook(book: GFBook): boolean {
    console.log('inside addTranAfterAddBook');
    this.googleApiService.getGAPI().client.gfBookStockService.addTranAfterAddBook(book).execute((data: any) => {
      console.log('data:' + data);
    });
    return true;
  }

  public getGFBookByInstituteId(instituteID: number): Promise<GFBook[]> {
    console.log('Came to partnerSchoolService:getGFBookByInstituteId');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay   
      this.googleApiService.getGAPI().client.gfBookStockService.getGFBookByInstituteId({ 'instituteID': instituteID }).execute((data: any) => {
        console.log('data.items:' + data.items);
        resolve(data.items);
      });
    });
  }

  public getGFBookStockTransactionByInstituteId(instituteID: number): Promise<GFBookTransaction[]> {
    console.log('Came to partnerSchoolService:getGFBookByInstituteId');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.gfBookStockService.getGFBookStockTransactionByInstituteId({ 'instituteID': instituteID }).execute((data: any) => {
        console.log('data.items:' + data.items);
        resolve(data.items);
      });
    });
  }
}