import { Injectable } from '@angular/core';

@Injectable()
export class RouteData {

    public params: any;

    public constructor() {
        this.params = {};
    }
}
