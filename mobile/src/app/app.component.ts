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
import {TranslateService} from '@ngx-translate/core';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(private translate: TranslateService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    translate.addLangs(["it", "en"]);
    translate.setDefaultLang('it');

    translate.setTranslation('en', {
        Home: 'Home',
        Credits: "Credits",
        Preferiti: 'Favorites',
        Themes: 'Themes',
        Sources: "Sources",
        Tag: 'Tag',
    });
    translate.setTranslation('it', {
        Home: 'Home (it)',
        Credits: 'Referenze',
        Favorites: 'Preferiti',
        Themes: 'Temi',
        Sources: "Sorgenti",
        Tag: 'Etichette',
    });


    let browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/it|en/) ? browserLang : 'en');

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Themes', component: TemiPage },
      { title: 'Sources', component: SorgentiPage },
      { title: 'Tag', component: TagPage },
      { title: 'Preferiti', component: FavoritesPage },
      { title: 'Credits', component: CreditsPage },
    ];


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
    this.nav.setRoot(page.component);
  }
}
