import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Globalization } from '@ionic-native/globalization';
import * as moment from 'moment'
import { AppConfig } from './app.config';

import { HomePage } from '../pages/home/home';
import { TemiPage } from '../pages/temi/temi';
import { SorgentiPage } from '../pages/sorgenti/sorgenti';
import { TagPage } from '../pages/tag/tag';
import { FavoritesPage } from '../pages/favorites/favorites';
import { CreditsPage } from '../pages/credits/credits';
import { TranslateService } from '@ngx-translate/core';
import { QuestionnaireService } from '../services/questionnaire-service';
import { TermsPage } from '../pages/terms/terms';
import { ConfigSrv } from '../services/config-service';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  navigator: any;

  pages: Array<{ icon: string, title: string, component: any }>;

  constructor(private translate: TranslateService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private configSrv: ConfigSrv, public questionnaireService: QuestionnaireService, public globalization: Globalization, public config: AppConfig,
    public alertCtrl: AlertController) {

    this.initializeApp();

    translate.addLangs(["it", "en"]);
    // translate.setDefaultLang('it');

    translate.setTranslation('en', {
      Home: 'Home',
      Credits: "Credits",
      Favorites: 'Favorites',
      Themes: 'Themes',
      Sources: "Sources",
      Questionnaire: "Questionnaire",
      Tag: 'Tags',
      Filtercontent: 'Filter content',
      Cancel: 'Cancel',
      Published: 'Published on: ',
      EventDate: 'Event date: ',
      AddressNotFound: 'There are no informations regarding the event address',
      Place: 'Place: ',
      OK: 'OK',
      FilterNotFound: 'There are no events based on your filters',
      FavoriteThemes: 'Favorite themes  ',
      FavoriteSources: 'Favorite sources  ',
      FavoriteEvents: 'Favorite notifications  ',
      Filter: 'Filter',
      FilterCancel: 'Cancel',
      Time: 'Time: ',
      EventsArea: 'Events in this area',
      Loading: 'Loading',
      lbl_error: 'error',
      lbl_terms_of_service: 'Terms of service',
      lbl_accept: 'Accept',
      lbl_reject: 'Reject',
      about_subtitle: 'Information and Terms of Use',
      terms_refused_alert_text: 'Terms refused.',
      information: "Il progetto WeLive è stato finanziato dal programma H2020 della Commissione Europea per la ricerca, lo sviluppo tecnologico e l’ innovazione secondo l’accordo N° 645845",
      menu_about: 'Information',
      app_name: 'TrentoInformer',
      lbl_credit_p2: "What is it?",
      credit_info: "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584",
      lbl_wait: "Please wait",
      trial_expired: "Your trial version has expired.",
      trial_inprogress: " days left for this trial version.",
      pop_up__expired_template: 'The trial version of the app has expired',
      pop_up_not_expired_title: 'Trial version',
      pop_up_not_expired_template: 'This is a trial version expiring on ',
      search_label: 'Search'


    });
    translate.setTranslation('it', {
      Home: 'Home',
      Credits: "Credits",
      Favorites: 'Preferiti',
      Themes: 'Temi',
      Sources: "Sorgenti",
      Questionnaire: "Questionario",
      Tag: 'Etichette',
      Filtercontent: 'Filtra contenuti',
      Cancel: 'Annulla',
      Published: 'Pubblicato il: ',
      EventDate: "Data evento: ",
      AddressNotFound: "Nessuna informazione sull'indirizzo dell'evento",
      Place: 'Luogo: ',
      OK: 'OK',
      FilterNotFound: 'Non sono stati trovati eventi corrispondenti ai tuoi filtri',
      FavoriteThemes: 'Temi preferiti  ',
      FavoriteSources: 'Sorgenti preferite  ',
      FavoriteEvents: 'Notifiche preferite  ',
      Filter: 'Filtra',
      FilterCancel: 'Annulla',
      Time: 'Ora: ',
      EventsArea: 'Eventi in questa zona',
      Loading: 'Caricamento',
      lbl_error: 'errore',
      lbl_terms_of_service: 'Termini di utilizzo',
      lbl_accept: 'Accetto',
      lbl_reject: 'Rifiuto',
      about_subtitle: 'Termini e condizioni di utilizzo',
      terms_refused_alert_text: 'Termini rifiutati.',
      information: "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584.",
      menu_about: 'Informazioni',
      app_name: 'TrentOrienta',
      lbl_credit_p2: "Che cosa è?",
      credit_info: "Il progetto WeLive è stato finanziato dal programma H2020 della Commissione Europea per la ricerca, lo sviluppo tecnologico e l’ innovazione secondo l’accordo N° 645845",
      lbl_wait: "Attendere prego",
      trial_expired: "La versione trial è scaduta.",
      trial_inprogress: " giorni rimasti per questa versione trial.",
      pop_up_expired_title: 'Versione scaduta',
      pop_up__expired_template: 'Ci scusiamo ma non è più possibile utilizzare questa versione dell\'applicazione in quanto il periodo di prova è terminata',
      pop_up_not_expired_title: 'Versione di prova',
      pop_up_not_expired_template: 'Questa  è una versione di prova e terminerà il ',
      search_label: 'Cerca'
    });


    // let browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/it|en/) ? browserLang : 'en');

    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'home', title: 'Home', component: HomePage },
      { icon: 'flag', title: 'Themes', component: TemiPage },
      { icon: 'folder', title: 'Sources', component: SorgentiPage },
      { icon: 'pricetag', title: 'Tag', component: TagPage },
      { icon: 'star', title: 'Favorites', component: FavoritesPage },
      { icon: 'help-circle', title: 'Questionnaire', component: null },
      { icon: 'information-circle', title: 'Credits', component: CreditsPage },
      { icon: 'alert', title: 'lbl_terms_of_service', component: TermsPage }
    ];

    // conditional setting of rootpage.
    configSrv.readIsPrivacyAccepted().then(flag => {
      if (flag) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = TermsPage;
      }
    });

  }

  initializeApp() {

    this.platform.ready().then(() => {
      // this language will be used as a fallback when a translation isn't found in the current language
      this.translate.setDefaultLang("it");

      if ((<any>window).cordova) {
        this.globalization.getPreferredLanguage().then(result => {
          var language = this.getSuitableLanguage(result.value);
          this.translate.use(language);
          // Okay, so the platform is ready and our plugins are available.
          // Here you can do any higher level native things you might need.
          this.statusBar.styleDefault();
          this.splashScreen.hide();
        });
      } else {
        let browserLanguage = this.translate.getBrowserLang();
        var language = this.getSuitableLanguage(browserLanguage);
        this.translate.use(language);
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      }

      this.config.load().then(() => {

        // let expiryDate = new Date(this.config.getConfig('expiryDate'));
        // if (this.isDateAfterToday(expiryDate)) {
        //   var daysLeft = this.getNumberOfDays(expiryDate);
        //   console.log(daysLeft + " days left for this trial")
        //   let prompt = this.alertCtrl.create({
        //     title: this.translate.instant('pop_up_not_expired_title'),
        //     message: this.translate.instant('pop_up_not_expired_template') + moment(expiryDate).format('DD-MM-YYYY'),
        //     buttons: ['Ok']
        //   });
        //   prompt.present();
        // } else {
        //   let prompt = this.alertCtrl.create({
        //     title: this.translate.instant('pop_up_expired_title'),
        //     message: this.translate.instant('pop_up__expired_template'),
        //     buttons: [{
        //       text: 'Ok',
        //       role: 'cancel',
        //       handler: () => {
        //         console.log('Cancel clicked');
        //         this.nav.pop();
        //         this.platform.exitApp();
        //       }
        //     }]
        //   });
        //   prompt.present();
        // }

      });

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component)
      this.nav.setRoot(page.component);

    if (page.title === 'Questionnaire') {
      this.questionnaireService.openQuestionnaireWindow();
    }
  }

  getSuitableLanguage(language) {
    return language.substring(0, 2).toLowerCase();
    // return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
  }

  isDateAfterToday(date) {
    return new Date(date.toDateString()) >= new Date(new Date().toDateString());
  }

  getNumberOfDays(date) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return (Math.round(Math.abs((date.getTime() - new Date(new Date().toDateString()).getTime()) / (oneDay))));

  }
}
