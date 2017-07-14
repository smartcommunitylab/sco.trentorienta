import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';
import { ElementListPage } from '../elementList/elementList';

@Component({
  selector: 'page-sorgentiList',
  templateUrl: '../elementList/elementList.html',
  providers: [EventService]
})

export class SorgentiListPage extends ElementListPage {

    constructor(protected eventService: EventService, public navCtrl: NavController, public navParams: NavParams){
        super(eventService, navCtrl);
        this.title = this.navParams.get('name');
    }

    getData(from: number, to: number, filter: string): Promise<eventType[]> {
        return this.eventService.searchEvents(filter, from, to, null, null, this.navParams.get('name'));
    }

    getCalData(from: number, to: number): Promise<eventType[]> {
      return this.eventService.calendarEvents(from ,to, null, null, this.navParams.get('name'));
    }
}