import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { ElementListPage } from '../elementList/elementList';
import { eventType } from '../../app/struct-data';


@Component({
  selector: 'page-home',
  templateUrl: '../elementList/elementList.html'
})
export class HomePage extends ElementListPage {
    title =  "Home";

    constructor(protected eventService: EventService, public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams){
        super(eventService, navCtrl, alertCtrl);
        this.isHome = true;
    }

    getData(from: number, to: number, filter: string): Promise<eventType[]> {
        return this.eventService.searchEvents(filter, from ,to, this.navParams.get('temChosen'), null , this.navParams.get('sorChosen'));      
    }
    
    getCalData(from: number, to: number): Promise<eventType[]> {
      return this.eventService.calendarEvents(from ,to, this.navParams.get('temChosen'), null , this.navParams.get('sorChosen'));
    }

    
    
}
