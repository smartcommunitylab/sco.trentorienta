import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { EventService } from '../../app/event-service';
import { eventType,occurenciesType } from '../../app/struct-data';
import { HomePage } from '../home/home';
import { ConfigSrv} from '../../services/config-service'

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

    constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService,
        public storage: Storage, public utils: ConfigSrv) {
        
        this.storage.get('filterData')
            .then(filterData => {
                this.sorChose = filterData && filterData.sorChosen ? filterData.sorChosen : [];
                this.temChose = filterData && filterData.temChosen ? filterData.temChosen : [];
            });
    }

    filter(): void {
        let filterData = {
           temChosen: this.temChose,
           sorChosen: this.sorChose 
        };
        this.storage.set('filterData', filterData)
            .then(savedData => this.navCtrl.pop());
    }

    behind(): void{
        this.navCtrl.pop();
    }

    filterCancel(): void{
        this.temChose = null;
        this.sorChose = null;

        this.filter();
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