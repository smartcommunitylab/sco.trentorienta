import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';
import { ElementListPage } from '../elementList/elementList';

@Component({
  selector: 'page-tagList',
  templateUrl: '../elementList/elementList.html',
  providers: [EventService]
})

export class TagListPage extends ElementListPage {

    constructor(protected eventService: EventService, public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams){
        super(eventService, navCtrl, alertCtrl);
        this.title = this.navParams.get('name');
        this.tagging = true;
    }

    getData(from: number, to: number, filter: string): Promise<eventType[]> {
        return this.eventService.searchEvents(filter, from, to, null, this.navParams.get('name'));
    }

    getCalData(from: number, to: number): Promise<eventType[]> {
        return this.eventService.calendarEvents(from, to, null, this.navParams.get('name'));
    }

}