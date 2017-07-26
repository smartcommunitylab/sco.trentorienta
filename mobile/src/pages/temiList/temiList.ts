import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EventService } from '../../app/event-service';
import { eventType, occurenciesType } from '../../app/struct-data';
import { ElementListPage } from '../elementList/elementList';

@Component({
  selector: 'page-temiList',
  templateUrl: '../elementList/elementList.html',
  providers: [EventService]
})

export class TemiListPage extends ElementListPage {
    theme: occurenciesType;

    constructor(protected eventService: EventService, public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public storage: Storage){
        super(eventService, navCtrl, alertCtrl);
        this.title = this.navParams.get('name');
        this.data[0] = this.navParams.get('name');
        this.theme = this.navParams.get('tem');
        this.isTheme = true;
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

    addFav(theme: occurenciesType){
        theme.fav = !theme.fav;
        if(theme.fav){
        this.storage.get('themeFavs').then(themeFavs => {
            let a = this.checkIndex(themeFavs, theme);
            if(a < 0){
                themeFavs.push(theme);
            }
            this.storage.set('themeFavs', themeFavs);
        });
        } else {
        this.storage.get('themeFavs').then(themeFavs => {
            let a = this.checkIndex(themeFavs, theme);
            if(a >= 0){
                themeFavs.splice(a, 1);
            }
            this.storage.set('themeFavs', themeFavs);
        });
        }
    }

    getData(from: number, to: number, filter: string): Promise<eventType[]> {
        return this.eventService.searchEvents(filter, from, to, this.data);
    }

    getCalData(from: number, to: number, date?: string): Promise<eventType[]> {
        return this.eventService.calendarEvents(from, to, this.data, null, null, date);
    }
}