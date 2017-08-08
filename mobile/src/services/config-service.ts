import { Injectable } from '@angular/core';

var APP_NAME = 'trentorienta';
var REDIRECT_URI = "http://localhost";


@Injectable()
export class ConfigSrv {

    getAppName() {
        return APP_NAME;
    }

    getRedirectURL() {
        return REDIRECT_URI;
    }
}