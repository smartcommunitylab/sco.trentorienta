import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

var APP_NAME = 'trentorienta';
var REDIRECT_URI = "http://localhost";


@Injectable()
export class ConfigSrv {

    constructor(private storage: Storage) { }
    
    getAppName() {
        return APP_NAME;
    }

    getRedirectURL() {
        return REDIRECT_URI;
    }

    readIsPrivacyAccepted(): Promise<String> {
        return this.storage.get("isPrivacyAccepted").then(flag => { return flag });
    }
}