import { Injectable } from '@angular/core';

import { GoogleEndpointService } from './google-endpoint.service';


export class User {
  role: string = 'Student';
  instituteID: string = '5910974510923776';
  password: string = '1';
}

@Injectable()
export class UserService {
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

  public saveUser(user: User): boolean {
    this.gapi.client.userService.addUser(user).execute((data: any) => {
      console.log('data:' + data);
    });
    return true;
  }

  public getUserList(): Promise<User[]> {
    console.log('Came to UserService:getUserList');
    // This is one way of calling async
    return new Promise(resolve => {
      // Simulate server latency with 2 second delay      
      this.gapi.client.userService.getUserList().execute((data: any) => {
        console.log('data.items:' + data.items);
        resolve(data.items);
      });
    });
    //Second way ??
  }
}
