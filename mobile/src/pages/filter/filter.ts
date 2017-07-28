import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EventService } from '../../app/event-service';
import { eventType,occurenciesType } from '../../app/struct-data';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})

export class FilterPage implements OnInit{
    temList: occurenciesType[] = [];
    sorList: occurenciesType[] = [];

    tryout: eventType[];

    temChose: string[];
    sorChose: string[];

    constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService, public storage: Storage) {

    }
    
    filter(): void{
        this.storage.set('temChosen', this.temChose)
            .then(temChosen => {
                this.storage.set('sorChosen',this.sorChose)
                    .then(sorChosen => {
                        this.navCtrl.pop();
                    })
            })
    }

    behind(): void{
        this.navCtrl.pop();
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