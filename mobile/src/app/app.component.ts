import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Globalization } from '@ionic-native/globalization';

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

  pages: Array<{ icon: string, title: string, component: any }>;

  constructor(private translate: TranslateService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private configSrv: ConfigSrv, public questionnaireService: QuestionnaireService, public globalization:Globalization) {
    
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
      Tag: 'Tag',
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
      FavoriteEvents: 'Favorite events  ',
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
      information: "The WeLive Player gives the possibility to discover and launch the mobile apps developed by WeLive users using the WeLive framework.<br /><br />The WeLive framework is one of the results of the WeLive project, a H2020 project funded by the EU, whose goal is to foster a new concept of public administration, based on citizen co-created mobile urban services.<br /><br />The WeLive Player is a container in which all the services created by WeLive users using the WeLive framework, and exposed onto the WeLive Marketplace, are shown and suggested to Android users basing on their preferences.<br /><br />The available services are grouped by the four pilot cities/regions involved in the project: Bilbao, Helsinki-Usimaa, Novi Sad, Trento.<br /><br />The app allows to filter, search and order the apps using different criteria. It requires to authenticate using wither a social (Google/Facebook) or a WeLive account. During the authentication process the user is asked to optionally provide some personal details that are used by the WeLive framework to suggest apps that are more likely to be of interest.<br /><br />The WeLive Player allows to download and launch the apps chosen by the user. Finally, it shows the comments and ratings expressed by the users on the WeLive Marketplace about the apps.",
      menu_about: 'Information',
      app_name: 'TrentoInforma',
      lbl_credit_p2: "What is it?",
      credit_info: "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584",
      lbl_wait: "Please wait"

    });
    translate.setTranslation('it', {
      Home: 'Home',
      Credits: 'Referenze',
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
      FavoriteEvents: 'Eventi preferiti  ',
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
      information: "WeLive Player permette di scoprire e lanciare le applicazioni mobile sviluppate dagli utenti WeLive attraverso l'utilizzo della piattaforma WeLive. <br /> <br /> Tale piattaforma è uno dei risultati del progetto WeLive, un progetto H2020 finanziato dall'UE, il cui obiettivo è quello di promuovere un nuovo concetto di pubblica amministrazione, basato sulla co-creazione di servizi urbani mobili, insieme ai cittadini.<br /><br />WeLive Player è un contenitore in cui tutti i servizi creati dagli utenti WeLive, utilizzando la piattaforma WeLive, ed esposti sul Marketplace di WeLive, vengono mostrati e suggeriti agli utenti Android in base alle loro preferenze.<br /><br />I servizi disponibili sono raggruppati secondo le quattro città/regioni pilota coinvolte nella sperimentazione all'interno del progetto: Bilbao, Helsinki-Uusimaa, Novi Sad, Trento.<br /><br />L'applicazione permette di filtrare, cercare e ordinare le applicazioni in base a diversi criteri. All'utente viene chiesto di autenticarsi utilizzando un account social (Google/Facebook) o il proprio account WeLive. Durante il processo di autenticazione l'utente è invitato a fornire in modo facoltativo alcuni dati personali che verranno poi utilizzati dalla piattaforma WeLive per suggerire applicazioni potenzialmente interessanti per l'utente.<br /><br />WeLive Player permette quindi all'utente di scaricare e lanciare sul proprio smartphone le applicazioni scelte. Infine, esso mostra i commenti e le valutazioni espresse dagli utenti sul Marketplace di WeLive relativamente di tutte le applicazioni mostrate.",
      menu_about: 'Informazioni',
      app_name: 'TrentOrienta',
      lbl_credit_p2: "Che cosa è?",
      credit_info: "Il progetto WeLive è stato finanziato dal programma H2020 della Commissione Europea per la ricerca, lo sviluppo tecnologico e l’ innovazione secondo l’accordo N° 645845",
      lbl_wait: "Attendere prego"
      
    });


    // let browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/it|en/) ? browserLang : 'en');

    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'home', title: 'Home', component: HomePage },
      { icon: 'flag', title: 'Themes', component: TemiPage },
      { icon: 'folder', title: 'Sources', component: SorgentiPage },
      { icon: 'help-circle', title: 'Questionnaire', component: null },
      { icon: 'pricetag', title: 'Tag', component: TagPage },
      { icon: 'star', title: 'Favorites', component: FavoritesPage },
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
}
