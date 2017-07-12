import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';
import { ElementListPage } from '../elementList/elementList';

@Component({
  selector: 'page-tagList',
  templateUrl: 'tagList.html',
  providers: [EventService]
})

export class TagListPage extends ElementListPage implements OnInit{

    constructor(protected eventService: EventService, public navCtrl: NavController, public navParams: NavParams){
        super(eventService, navCtrl);

    }

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

    getData(from: number, to: number): Promise<eventType[]> {
        return this.eventService.getEventsByTag(this.navParams.get('name'),from ,to);
    }

    ngOnInit(): void{
        this.getEvents();
    }
}