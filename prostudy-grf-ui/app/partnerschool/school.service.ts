import { Injectable } from '@angular/core';

import { GoogleEndpointService } from './google-endpoint.service';

import { PartnerSchool, ExamDetail } from './partner-school';



@Injectable()
export class PartnerSchoolService {

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


  public saveSchool(school: PartnerSchool): boolean {
    this.gapi.client.partnerSchoolService.addPartnerSchool(school).execute((data: any) => {
      console.log('data:' + data);
    });
    return true;
  }

  public getPartnerByInstitute(instituteID: number): Promise<PartnerSchool[]> {
    console.log('Came to partnerSchoolService:getPartnerByInstitute');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.gapi.client.partnerSchoolService.getPartnerByInstitute({ 'instituteID': instituteID }).execute((data: any) => {
        console.log('data.items:' + data.items);
        resolve(data.items);
      });
    });
    //Second way ??
  }
}