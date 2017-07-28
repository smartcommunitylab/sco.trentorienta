import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EventService } from '../../app/event-service';
import { eventType, occurenciesType } from '../../app/struct-data';
import { ElementListPage } from '../elementList/elementList';

@Component({
  selector: 'page-sorgentiList',
  templateUrl: '../elementList/elementList.html',
  providers: [EventService]
})

export class SorgentiListPage extends ElementListPage{
    source: occurenciesType;

    constructor(protected eventService: EventService, public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public storage: Storage){
        super(eventService, navCtrl, alertCtrl, storage);
        this.title = this.navParams.get('name');
        this.data[0] = this.navParams.get('name');
        this.source = this.navParams.get('sor');
        this.isSor = true;
    }

    checkIndex(b: occurenciesType[], e: occurenciesType): number{
        let a = -1;
            b.forEach(evento => {
                if(evento.name == e.name){
                    a = b.indexOf(evento);
                }
            });
        return a;
    }

    addFav(source: occurenciesType){
        source.fav = !source.fav;
        if(source.fav){
            this.storage.get('sorFavs').then(sorFavs => {
                let a = this.checkIndex(sorFavs, source);
                if(a < 0){
                    sorFavs.push(source);
                }
                this.storage.set('sorFavs', sorFavs);
            });
        } else {
            this.storage.get('sorFavs').then(sorFavs => {
                let a = this.checkIndex(sorFavs, source);
                if(a >= 0){
                    sorFavs.splice(a, 1);
                }
                this.storage.set('sorFavs', sorFavs);
            });
        }
    }

    getData(from: number, to: number, filter: string): Promise<eventType[]> {
        return this.eventService.searchEvents(filter, from, to, null, null, this.data);
    }

    getCalData(from: number, to: number, date?: string): Promise<eventType[]> {
      return this.eventService.calendarEvents(from ,to, null, null, this.data, date);
    }
}