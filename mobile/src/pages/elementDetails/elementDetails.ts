import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';

@Component({
    selector:'page-elementDetails',
    templateUrl:'elementDetails.html',
    providers:[EventService]
})

export class ElementDetailsPage implements OnInit{
    event: eventType = new eventType();//{id: 0,  title: '', description: '', image:'', tags:[''], source:'', themes: [''], created: ''};
    constructor(private eventService: EventService, public navParams: NavParams){

    }
    ngOnInit(): void{
        this.eventService.getEvent(this.navParams.get('id'))
                        .then(event => {this.event = event});
    }
}