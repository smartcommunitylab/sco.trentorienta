import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EventService } from '../../app/event-service';
import { ElementListPage } from '../elementList/elementList';
import { eventType, occurenciesType } from '../../app/struct-data';


@Component({
  selector: 'page-home',
  templateUrl: '../elementList/elementList.html'
})
export class HomePage extends ElementListPage {
    title =  "Home";
    temChosen: occurenciesType[] = [];
    sorChosen: occurenciesType[] = [];


    constructor(protected eventService: EventService, public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public storage: Storage){
        super(eventService, navCtrl, alertCtrl, storage);
        this.isHome = true;
    }

    getData(from: number, to: number, filter: string): Promise<eventType[]> {
        return this.storage.get('temChosen')
            .then(temChosen => {
                return this.storage.get('sorChosen')
                    .then(sorChosen => {
                        return this.eventService.searchEvents(filter, from, to, temChosen, null, sorChosen)
                    }) 
            })
    }
    
    getCalData(from: number, to: number, data?: string): Promise<eventType[]> {
        return this.storage.get('temChosen')
            .then(temChosen => {
                return this.storage.get('sorChosen')
                    .then(sorChosen => {
                        return this.eventService.calendarEvents(from, to, temChosen, null, sorChosen, data)
                    }) 
            })    
    }
}
