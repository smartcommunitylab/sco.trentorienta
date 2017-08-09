import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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

  rootPage: any = HomePage;

  pages: Array<{ icon: string, title: string, component: any }>;

  constructor(private translate: TranslateService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private configSrv: ConfigSrv, public questionnaireService: QuestionnaireService) {
    
    this.initializeApp();

    translate.addLangs(["it", "en"]);
    translate.setDefaultLang('it');

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
      FilterCancel: 'Cancel filter',
      Time: 'Time: ',
      EventsArea: 'Events in this area',
      Loading: 'Loading',
    });
    translate.setTranslation('it', {
      Home: 'Home (it)',
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
      FilterCancel: 'Rimuovi filtro',
      Time: 'Ora: ',
      EventsArea: 'Eventi in questa zona',
      Loading: 'Caricamento',
    });


    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/it|en/) ? browserLang : 'en');

    // used for an example of ngFor and navigation
    this.pages = [
      { icon: 'home', title: 'Home', component: HomePage },
      { icon: 'flag', title: 'Themes', component: TemiPage },
      { icon: 'folder', title: 'Sources', component: SorgentiPage },
      { icon: 'help-circle', title: 'Questionnaire', component: null },
      { icon: 'pricetag', title: 'Tag', component: TagPage },
      { icon: 'star', title: 'Favorites', component: FavoritesPage },
      { icon: 'information-circle', title: 'Credits', component: CreditsPage },
      { icon: 'alert', title: 'Terms', component: TermsPage }
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
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
}
