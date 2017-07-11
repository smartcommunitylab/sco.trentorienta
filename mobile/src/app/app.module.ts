import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule }    from '@angular/http';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';
import { EventService } from './event-service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TemiPage } from '../pages/temi/temi';
import { SorgentiPage } from '../pages/sorgenti/sorgenti';
import { TagPage } from '../pages/tag/tag';
import { FavoritesPage } from '../pages/favorites/favorites';
import { CreditsPage } from '../pages/credits/credits';
import { ElementDetailsPage } from '../pages/elementDetails/elementDetails';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TemiPage,
    SorgentiPage,
    TagPage,
    FavoritesPage,
    CreditsPage,
    ElementDetailsPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TemiPage,
    SorgentiPage,
    TagPage,
    FavoritesPage,
    CreditsPage,
    ElementDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EventService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

