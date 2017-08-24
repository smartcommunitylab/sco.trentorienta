import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Headers, Http } from '@angular/http';
import { NavController, ViewController, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
    selector: 'terms',
    templateUrl: 'terms.html',
    styleUrls: ['/pages/terms/terms-component.scss', 'build/main.css']
})

export class TermsPage {
   
    lbl_terms_of_service: String;
    termsFile: any;
    accepting: Boolean;
  
    constructor(private http: Http, public translate: TranslateService, public storage: Storage, public nav: NavController,
        public viewCtrl: ViewController, public modalCtrl: ModalController) {

        // translate.addLangs(["it", "en"]);

        // translate.setTranslation('it', {
        //     lbl_terms_of_service: 'Termini di utilizzo',
        //     lbl_accept: 'Accetto',
        //     lbl_reject: 'Rifiuto',
        //     about_subtitle: 'Termini e condizioni di utilizzo',
        //     terms_refused_alert_text: 'Termini rifiutati.'
        // });

        // translate.setTranslation('en', {
        //     lbl_terms_of_service: 'Terms of service',
        //     lbl_accept: 'Accept',
        //     lbl_reject: 'Reject',
        //     about_subtitle: 'Information and Terms of Use',
        //     terms_refused_alert_text: 'Terms refused.',
        // });

        // load html file.
        var url = 'resources/terms-' + translate.currentLang.toString() + '.html';
        this.load(url).then(resp => this.termsFile = resp);
        // set flag (to show accept refuse button)
        this.readIsPrivacyAccepted().then(flag => {
            this.accepting = !flag
        });
        this.lbl_terms_of_service = translate.instant('lbl_terms_of_service');

    }

    load(url: string): Promise<String> {
        var promise = this.http.get(url).map(res => res.text()).toPromise();
        return promise;
    }

    goToProposalsList = function () {
        debugger;
        this.nav.setRoot(HomePage);

    }


    acceptPrivacy = function () {
        this.setPrivacyAccepted().then(flag => {
            this.accepting = flag;
        });
        this.goToProposalsList();
    };

    refusePrivacy = function () {

        let prompt = this.alertCtrl.create({
            title: '',
            subTitle: this.translate.instant('terms_refused_alert_text')
        });
        prompt.present();
        setTimeout(function () {
            this.navigator.app.exitApp(); // sometimes doesn't work with Ionic View
            this.Platform.exitApp();
            console.log('App closed');
            prompt.dismiss();
        }, 1800) //close the popup after 1.8 seconds for some reason

    };

    readIsPrivacyAccepted(): Promise<String> {
        return this.storage.get("isPrivacyAccepted").then(flag => { return flag });
    }

    setPrivacyAccepted(): Promise<String> {
        return this.storage.set("isPrivacyAccepted", "true").then(flag => { return flag });
    }

}
