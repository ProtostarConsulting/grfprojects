import { Injectable } from '@angular/core';

import { GoogleEndpointService } from '../core/google-endpoint.service';
import { PartnerSchool } from '../partnerschool/partner-school';


export class User {
  id: string;
  role: string;
  instituteID: string = '5910974510923776';
  firstName: string;
  lastName: string;
  address: string;
  contact: string;
  standard: string;
  password: string;
  email_id: string;
  status: string;
  isGoogleUser: boolean;
  school: PartnerSchool;
}

@Injectable()
export class UserService {
  private gapi: any;
  constructor(private googleApiService: GoogleEndpointService) {
    this.gapi = googleApiService.getGAPI();
  }

  public saveUser(user: User): Promise<User> {
    return new Promise(resolve => {
      this.googleApiService.getGAPI().client.userService.addUser(user).execute((data: any) => {
        console.log('data:' + data);
        resolve(data);
      });
    });
  }

  public getUserList(): Promise<User[]> {
    console.log('Came to UserService:getUserList');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.userService.getUserList().execute((data: any) => {
        console.log('data.items:' + data.items);
        resolve(data.items);
      });
    });
    //Second way ??
  }

  public login(email: string, pass: string): Promise<User> {
    console.log('Came to UserService:getUserList');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.googleApiService.getGAPI().client.userService.login({
        'email_id': email,
        'password': pass
      }).execute((data: any) => {
        console.log('data.items:' + data);
        resolve(data);
      });
    });
    //Second way ??
  }
}
