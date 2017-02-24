import { Injectable } from '@angular/core';

import { GoogleEndpointService } from '../core/google-endpoint.service';


export class User {
  id: string;
  role: string = 'Student';
  instituteID: string = '5910974510923776';
  password: string = '1';
}

@Injectable()
export class UserService {
  private gapi: any;
  constructor(private googleApiService: GoogleEndpointService) {
    this.gapi = googleApiService.getGAPI();
  }

  public saveUser(user: User): boolean {
    this.googleApiService.getGAPI().client.userService.addUser(user).execute((data: any) => {
      console.log('data:' + data);
    });
    return true;
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
}
