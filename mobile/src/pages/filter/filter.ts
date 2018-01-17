import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { EventService } from '../../app/event-service';
import { eventType,occurenciesType } from '../../app/struct-data';
import { HomePage } from '../home/home';
import { ConfigSrv} from '../../services/config-service'
import { Button } from 'ionic-angular/components/button/button';
import { ModalPage } from './modal/modal';


@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})

export class FilterPage implements OnInit{
    temList: occurenciesType[] = [];
    sorList: occurenciesType[] = [];

    List: occurenciesType[] = [];

    tryout: eventType[];

    temChose: string[];
    sorChose: string[];

    distance: number = -1;
    value: number = 0;

    constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService,
        public storage: Storage, public utils: ConfigSrv, public modalCtrl: ModalController, public translate: TranslateService) {
        
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

    modal(theOrSor: boolean, s: string[]) {
        let modal;
        if(theOrSor) {
            modal = this.modalCtrl.create(ModalPage, { 'theOrSor': theOrSor, 'List': this.temList, 'Chose': this.temChose });
        }
        else {
            modal = this.modalCtrl.create(ModalPage, { 'theOrSor': theOrSor, 'List': this.sorList, 'Chose': this.sorChose });
        }   
        modal.onDidDismiss( (Chose: any) => { 
            if(theOrSor) {
                if(Chose != null) {
                    this.temChose = Chose;
                }
            } 
            else {
                if(Chose != null) {
                    this.sorChose = Chose;
                }
            }
        });
            
        modal.present();
    }

    change() {
        switch (this.value)
        {
            case 0:
                this.distance = 5;
                break;
            case 1:
                this.distance = 10;
                break;
            case 2:
                this.distance = 20;
                break;
            case 3:
                this.distance = 50;
                break;
            case 4:
                this.distance = 100;
                break;
        }
    }

    dist() {
        if(this.distance == -1) this.change();
        else this.distance = -1;
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