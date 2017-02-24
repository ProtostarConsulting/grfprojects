import { Injectable } from '@angular/core';

const url = 'https://apis.google.com/js/client.js?onload=__onGoogleLoaded';
const gapiOnLoaded = '__onGoogleLoaded';
const clientName = 'gapi';
const endpointhost = 'localhost:8888';
const apiEndPoint = '//' + endpointhost + '/_ah/api';

@Injectable()
export class GoogleEndpointService {
  private gapi: any;
  private loadAPI: Promise<any>;
  constructor() {
    this.loadAPI = new Promise((resolve) => {
      window[gapiOnLoaded] = (ev: any) => {
        this.gapi = window[clientName];
        // Loads the OAuth and other APIs asynchronously, and triggers login
        // when they have completed.
        let apisToLoad = 2; // must match number of calls to gapi.client.load()
        let callback = function () {
          console.log('apisToLoad : ' + apisToLoad);
          if (--apisToLoad === 0) {
            resolve(window[clientName]);
          }
        };
        //this.gapi.load('client:auth2', callback);
        //this.gapi.client.load('gfBookStockService','v0.1', callback, apiEndPoint);
        this.gapi.client.load('userService', 'v0.1', callback, apiEndPoint);
        this.gapi.client.load('partnerSchoolService', 'v0.1', callback, apiEndPoint);
      };
      this.loadScript();
    });
  }

  public GetClient(): any {
    return this.loadAPI.then((res) => {
      return this.gapi;
    });
  }

  private loadScript() {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(node);
  }
}