import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfigSrv } from '../services/config-service';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@Injectable()
export class QuestionnaireService {

    constructor(public iab: InAppBrowser, private translate: TranslateService, private ConfigSrv: ConfigSrv) { }

    url = 'https://in-app.cloudfoundry.welive.eu/html/index.html?app=' + this.ConfigSrv.getAppName() + '&pilotId=Trento' + '&callback=' + this.ConfigSrv.getRedirectURL() +
    '&lang=' + this.translate.getBrowserLang().toUpperCase();

    openQuestionnaireWindow(): Promise<any> {


        return new Promise((resolve, reject) => {

            let browser = this.iab.create(this.url, '_blank');

            let listener = browser.on('loadstart').subscribe((event: any) => {

                //Check the redirect uri
                if (event.url.indexOf(this.ConfigSrv.getRedirectURL()) > -1) {

                    var status = /http:\/\/localhost(\/)?\?questionnaire-status=(.+)$/.exec(event.url);
                    if ((status)) {
                        listener.unsubscribe();
                        browser.close();
                    }
                    resolve(event.url);
                } else {
                    reject("Could not authenticate");
                }
            });
        });

    }

}