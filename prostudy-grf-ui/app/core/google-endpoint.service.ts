import { Injectable } from '@angular/core';

import { ApiConfig } from './api.config';

const url = 'https://apis.google.com/js/client.js?onload=__onGoogleLoaded';
const gapiOnLoaded = '__onGoogleLoaded';
const clientName = 'gapi';

@Injectable()
export class GoogleEndpointService {
  private gapi: any;
  private isEPloaded: boolean = false;
  private loadAPI: Promise<any>;
  constructor(apiConfig: ApiConfig) {
    const endpointhost = apiConfig.endpointhost;
    const apiEndPoint = '//' + endpointhost + '/_ah/api';

    this.loadAPI = new Promise((resolve) => {
      let pro_this = this;
      window[gapiOnLoaded] = (ev: any) => {
        this.gapi = window[clientName];
        // Loads the OAuth and other APIs asynchronously, and triggers login
        // when they have completed.
        let apisToLoad = 5; // must match number of calls to gapi.client.load()
        let callback = function () {
          console.log('Loading API : ' + apisToLoad);
          if (--apisToLoad === 0) {
            pro_this.isEPloaded = true;
            resolve(window[clientName]);
          }
        };
        this.gapi.client.load('gfBookStockService','v0.1', callback, apiEndPoint);
        this.gapi.client.load('userService', 'v0.1', callback, apiEndPoint);
        this.gapi.client.load('partnerSchoolService', 'v0.1', callback, apiEndPoint);
        this.gapi.client.load('gfCourierService', 'v0.1', callback, apiEndPoint);
        this.gapi.client.load('gfStudentService', 'v0.1', callback, apiEndPoint);
      };
      this.loadScript();
    });
  }

  public getClient(): any {
    if (this.isEPloaded) {
      return new Promise((resolve) => { resolve('Already Loaded'); }).then((res) => {
        return this.gapi;
      });
    } else {
      return this.loadAPI.then((res) => {
        return this.gapi;
      });
    }
  }

  public getGAPI(): any {
    return this.gapi;
  }

  private loadScript() {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}