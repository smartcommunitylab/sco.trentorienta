import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';
import { ElementDetailsPage } from '../elementDetails/elementDetails';



@Component({
  selector: 'page-elementList',
  templateUrl: 'elementList.html',
  providers: [EventService]
})

export class ElementListPage implements OnInit{
    elementList: string = "lista";
    mainEvents : eventType[] = [];
    selectedEvent : eventType;
    hasMore : boolean = true;
    constructor(private eventService: EventService, public navCtrl: NavController){
    }

    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        this.getEvents(this.mainEvents.length, this.mainEvents.length + 10, infiniteScroll);
    }

    getEvents(from: number, to: number, infiniteScroll: any): void {
        if(this.hasMore){
            this.eventService
                .getEvents(from ,to)
                .then(mainEvents => {
                    this.mainEvents = this.mainEvents.concat(mainEvents);
                    if (infiniteScroll != null) {
                        infiniteScroll.complete();
                    }
                    if(mainEvents == null || mainEvents.length == 0){
                        this.hasMore = false;
                    }                    
                });
        } else {
            infiniteScroll.complete();
        }
    }

    ngOnInit(): void{
        this.getEvents(0, 10, null);
    }

    onSelect(event: eventType): void{
        this.selectedEvent = event;
        this.navCtrl.push(ElementDetailsPage, {id: this.selectedEvent.id} )
    }
}