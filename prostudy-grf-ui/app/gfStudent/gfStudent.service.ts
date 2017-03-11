import { Injectable } from '@angular/core';

import { GoogleEndpointService } from '../core/google-endpoint.service';
import { PartnerSchool } from '../partnerschool/partner-school';

export class GFStudent {
  id: string;
  fName: string;
  mName: string;
  lName: string;
  standard: string;
  mediumOfAnswer: string;
  gender: string;
  instituteID: number;
  prn: string;
  role: string;
  school: PartnerSchool;
}

@Injectable()
export class GfStudentService {

  private gapi: any;
  constructor(private googleApiService: GoogleEndpointService) {
    this.gapi = googleApiService.getClient();
  }

  public addStudent(student: GFStudent): Promise<GFStudent> {
    return new Promise(resolve => {
      this.googleApiService.getGAPI().client.gfStudentService.addGFStudent(student).execute((data: GFStudent) => {
        resolve(data);
        console.log('data:' + data);
      });
    });
  }

  public getGFStudentsByInstitute(instituteID: number): Promise<GFStudent[]> {
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.gfStudentService.getGFStudentsByInstitute(
        { 'instituteID': instituteID }).execute((data: any) => {
          console.log('data.items:' + data.items);
          resolve(data.items);
        });
    });
    //Second way ??
  }

  public getGFStudentById(id: string): Promise<GFStudent> {
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.gfStudentService.getGFStudentById(
        { 'id': id }).execute((data: any) => {
          resolve(data);
        });
    });
    //Second way ??
  }

}