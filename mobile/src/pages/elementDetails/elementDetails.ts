import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';

@Component({
    selector:'page-elementDetails',
    templateUrl:'elementDetails.html',
    providers:[EventService]
})

export class ElementDetailsPage implements OnInit{
    event: eventType;
    dateEvent: any;
    createEvent: any
    constructor(private eventService: EventService, public navParams: NavParams){

    }
    ngOnInit(): void{
        this.eventService.getEvent(this.navParams.get('id'))
                        .then(event => {this.event = event;
                            this.dateEvent = moment(this.event.eventDate,'YYYYMMDDHHmmss');
                            this.createEvent = moment(this.event.created,'YYYYMMDDHHmmss').format('DD.MM.YYYY');
                        });
    }
}