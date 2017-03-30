import { Injectable } from '@angular/core';

import { GoogleEndpointService } from '../core/google-endpoint.service';

import { PartnerSchool, ExamDetail } from './partner-school';



@Injectable()
export class PartnerSchoolService {

  private gapi: any;
  constructor(private googleApiService: GoogleEndpointService) {
    this.gapi = googleApiService.getClient();  
  }

  public saveSchool(school: PartnerSchool): Promise<PartnerSchool> {
    return new Promise(resolve => {
      this.googleApiService.getGAPI().client.partnerSchoolService.addPartnerSchool(school).execute((data: PartnerSchool) => {
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

  public getInstituteByGRFNo(autoGenerated: string): Promise<PartnerSchool> {
    console.log('Came to partnerSchoolService:getInstituteByGRFNo');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.partnerSchoolService.getSchoolByAutoGeneratedID(
        { 'autoGenerated': autoGenerated }).execute((data: any) => {
          resolve(data.items[0]);
        });
    });
    //Second way ??
  }

  public getFinSummayReportData(instituteID: number): Promise<PartnerSchool> {
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.partnerSchoolService.getFinSummayReportData(
        { 'instituteID': instituteID }).execute((data: any) => {
          resolve(data);
        });
    });
    //Second way ??
  }

  public getSchoolByPaymentMode(paymentType: string): Promise<PartnerSchool> {
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.partnerSchoolService.getSchoolByPaymentMode(
        { 'payReceivedBy': paymentType }).execute((data: any) => {
          resolve(data.items);
        });
    });
    //Second way ??
  }

  public getExamResultEntities(): Promise<PartnerSchool[]> {
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.partnerSchoolService.getPendingResultSchools(
        {  }).execute((data: any) => {
          resolve(data.items);
        });
    });
    //Second way ??
  }

  public getSchoolByBId(id:string): Promise<PartnerSchool[]> {
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.partnerSchoolService.getSchoolByBId(
        { 'id': id }).execute((data: any) => {
          resolve(data.items);
        });
    });
    //Second way ??
  }

  public getSchoolByselfUpdateStatus(): Promise<PartnerSchool[]> {
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.partnerSchoolService.getSchoolByselfUpdateStatus(
        {  }).execute((data: any) => {
          resolve(data.items);
        });
    });
    //Second way ??
  }
}