import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { occurenciesType } from '../../app/struct-data';

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})

export class FilterPage implements OnInit{
    temList: occurenciesType[] = [];
    sorList: occurenciesType[] = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService) {

    }
    
    ngOnInit(): void{
        this.eventService.getThemesList()
            .then(temList => 
            {this.temList = this.temList.concat(temList);});
        this.eventService.getSourcesList()
            .then(sorList => 
            {this.sorList = this.sorList.concat(sorList);});
    }
}