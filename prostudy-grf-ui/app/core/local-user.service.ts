import { Injectable } from '@angular/core';
import { ApiConfig } from './api.config';

@Injectable()
export class LocalUserService {

    private user: any;
    getUser() {
        return this.user;
    }

    setUser(user: any) {
        this.user = user;
    }
}