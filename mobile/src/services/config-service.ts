import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

var APP_NAME = 'trentorienta';
var REDIRECT_URI = "http://localhost";


@Injectable()
export class ConfigSrv {

    constructor(private storage: Storage, private toastCtrl: ToastController, private translate:TranslateService) { 
        
        // translate.addLangs(["it", "en"]);
        // translate.setDefaultLang('it');
        
        // translate.setTranslation('en', {
        //     lbl_error: 'oops error',
        // });
        
        // translate.setTranslation('it', {
        //     lbl_error: 'oops errore',
        // });
        
        // let browserLang = translate.getBrowserLang();
        // translate.use(browserLang.match(/it|en/) ? browserLang : 'en');
    }

    
    getAppName() {
        return APP_NAME;
    }

    getRedirectURL() {
        return REDIRECT_URI;
    }

    readIsPrivacyAccepted(): Promise<String> {
        return this.storage.get("isPrivacyAccepted").then(flag => { return flag });
    }

    presentErrorToast() {
        let toast = this.toastCtrl.create({
            message: this.translate.instant('lbl_error'),
            // cssClass: '/services/toast.scss',
            duration: 3000
        });
        toast.present();
  }
}