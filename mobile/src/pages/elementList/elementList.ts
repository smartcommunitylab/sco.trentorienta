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

export abstract class ElementListPage implements OnInit{
    view: string = "lista";
    mainEvents : eventType[] = [];
    selectedEvent : eventType;

    // size of a chunk of data to load
    readonly PAGE_SIZE = 10;

    constructor(protected eventService: EventService, public navCtrl: NavController){
    }

    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        this.getEvents(infiniteScroll);
    }

    abstract getData(from: number, to: number): Promise<eventType[]>;

    getEvents(infiniteScroll?: any): void {
            this.getData(this.mainEvents.length,this.mainEvents.length + this.PAGE_SIZE)
                .then(mainEvents => {
                    this.mainEvents = this.mainEvents.concat(mainEvents);
                    if (infiniteScroll != null) {
                        if(mainEvents == null || mainEvents.length == 0){
                            infiniteScroll.enable(false);
                        }
                        infiniteScroll.complete();
                    }                    
                });
    }

    ngOnInit(): void{
        this.getEvents();
    }

    onSelect(event: eventType): void{
        this.selectedEvent = event;
        this.navCtrl.push(ElementDetailsPage, {id: this.selectedEvent.id} )
    }
}