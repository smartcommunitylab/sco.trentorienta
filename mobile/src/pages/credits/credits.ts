import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})

export class CreditsPage {
  version: string = null;

  constructor(private appVersion: AppVersion, private translate: TranslateService) {

    // debugger;
    appVersion.getVersionNumber().then((version) => {
      this.version = "v " + version;
    }).catch(function (error) {
      this.version = "v " + '0.1.0';
    });

  }

}
