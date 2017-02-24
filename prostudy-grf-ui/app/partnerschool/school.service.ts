import { Injectable } from '@angular/core';

import { GoogleEndpointService } from '../core/google-endpoint.service';

import { PartnerSchool, ExamDetail } from './partner-school';



@Injectable()
export class PartnerSchoolService {

  private gapi: any;
  constructor(private googleApiService: GoogleEndpointService) {
    this.gapi = googleApiService.getClient();
    // if (this.loadingEP) {
    //   googleApiService.GetClient().then((gapi: any) => {
    //     this.gapi = gapi;
    //     this.loadingEP = false;
    //   });
    // }
  }

  public saveSchool(school: PartnerSchool): Promise<PartnerSchool> {
    return new Promise(resolve => {
      this.gapi.client.partnerSchoolService.addPartnerSchool(school).execute((data: PartnerSchool) => {
        resolve(data);
        console.log('data:' + data);
      });
    });
  }

  public getPartnerByInstitute(instituteID: number): Promise<PartnerSchool[]> {
    console.log('Came to partnerSchoolService:getPartnerByInstitute');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.partnerSchoolService.getPartnerByInstitute(
        { 'instituteID': instituteID }).execute((data: any) => {
          console.log('data.items:' + data.items);
          resolve(data.items);
        });
    });
    //Second way ??
  }
}