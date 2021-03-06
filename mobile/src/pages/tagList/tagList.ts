import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';
import { ElementListPage } from '../elementList/elementList';

@Component({
  selector: 'page-tagList',
  templateUrl: '../elementList/elementList.html',
  providers: [EventService]
})

export class TagListPage extends ElementListPage {

    constructor(protected eventService: EventService, public navCtrl: NavController, public modalCtrl: ModalController,
        public navParams: NavParams, public storage: Storage, public loadingCtrl:LoadingController, public translate: TranslateService) {
        super(eventService, navCtrl, modalCtrl, storage, loadingCtrl, translate);
        this.title = this.navParams.get('name');
        this.tagging = true;
    }

    getData(from: number, to: number, filter: string): Promise<eventType[]> {
        return this.eventService.searchEvents(filter, from, to, null , [this.navParams.get('name')]);
    }

    getCalData(from: number, to: number, date?:string): Promise<eventType[]> {
        return this.eventService.calendarEvents(from, to, null, [this.navParams.get('name')], null, date);
    }

}