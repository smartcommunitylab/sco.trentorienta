import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';
import { ElementListPage } from '../elementList/elementList';

@Component({
  selector: 'page-temiList',
  templateUrl: 'temiList.html',
  providers: [EventService]
})

export class TemiListPage extends ElementListPage implements OnInit{

    constructor(protected eventService: EventService, public navCtrl: NavController, public navParams: NavParams){
        super(); ///PROBLEMA SCONOSCIUTO

    }

    getEvents(): void {
            this.getData(this.mainEvents.length,this.mainEvents.length + this.PAGE_SIZE)
                .then(mainEvents => {
                    this.mainEvents = this.mainEvents.concat(mainEvents);
                                        
                });
    }

    getData(from: number, to: number): Promise<eventType[]> {
        return this.eventService.getEventsByTheme(this.navParams.get('name'),from ,to);
    }

    ngOnInit(): void{
        this.getEvents();
    }
}