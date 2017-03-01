import { Injectable } from '@angular/core';

@Injectable()
export class ApiConfig {
    apiUrl: string;
    apiToken: string;
    endpointhost: string = 'localhost:8888';
}