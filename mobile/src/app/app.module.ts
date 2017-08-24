import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule, Http }    from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { DynamicComponentModule } from 'angular2-dynamic-component/index';

import { EventService } from './event-service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { TemiPage } from '../pages/temi/temi';
import { SorgentiPage } from '../pages/sorgenti/sorgenti';
import { TagPage } from '../pages/tag/tag';
import { FavoritesPage } from '../pages/favorites/favorites';
import { CreditsPage } from '../pages/credits/credits';
import { ElementDetailsPage } from '../pages/elementDetails/elementDetails';
import { TemiListPage } from '../pages/temiList/temiList';
import { TagListPage } from '../pages/tagList/tagList';
import { SorgentiListPage } from '../pages/sorgentiList/sorgentiList';
import { ObjNgFor } from '../pages/elementList/elementList';
import { FilterPage } from '../pages/filter/filter';
import { ConfigSrv } from '../services/config-service'
import { QuestionnaireService } from '../services/questionnaire-service'
import { TermsPage } from '../pages/terms/terms';
import { ModalContentPage } from '../pages/elementList/elementList';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TranslateModule} from '@ngx-translate/core';


import { LeafletModule } from '@asymmetrik/angular2-leaflet';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TemiPage,
    SorgentiPage,
    TagPage,
    FavoritesPage,
    CreditsPage,
    ElementDetailsPage,
    TemiListPage,
    TagListPage,
    SorgentiListPage,
    ObjNgFor,
    FilterPage,
    TermsPage,
    ModalContentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    IonicStorageModule.forRoot(),
    DynamicComponentModule,
    TranslateModule.forRoot({}),
    LeafletModule,
   ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TemiPage,
    SorgentiPage,
    TagPage,
    FavoritesPage,
    CreditsPage,
    ElementDetailsPage,
    TemiListPage,
    TagListPage,
    SorgentiListPage,
    FilterPage,
    TermsPage,
    ModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ConfigSrv,
    QuestionnaireService,
    InAppBrowser,
    AppVersion,
    EventService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

