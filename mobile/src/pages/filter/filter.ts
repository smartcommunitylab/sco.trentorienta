import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

import { EventService } from '../../app/event-service';
import { eventType,occurenciesType,district } from '../../app/struct-data';
import { HomePage } from '../home/home';
import { ConfigSrv} from '../../services/config-service'
import { Button } from 'ionic-angular/components/button/button';
import { ModalPage } from './modal/modal';
import { PACKAGE_ROOT_URL } from '@angular/core/src/application_tokens';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';


@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html'
})

export class FilterPage implements OnInit{
    temList: occurenciesType[] = [];
    sorList: occurenciesType[] = [];
    disList: district[] = [      //circoscrizioni/districts Trento
        {name: 'Gardolo', coordinates:[0,1]}, 
        {name: 'Meano', coordinates:[0,2]},
        {name: 'Bondone', coordinates:[0,3]},
        {name: 'Sardagna', coordinates:[0,4]},
        {name: 'Ravina-Romagnano', coordinates:[0,5]},
        {name: 'Argentario', coordinates:[0,6]},
        {name: 'Povo', coordinates:[0,7]},
        {name: 'Mattarello', coordinates:[0,8]},
        {name: 'Villazzano', coordinates:[0,9]},
        {name: 'Oltrefersina', coordinates:[0,10]},
        {name: 'Giuseppe S.Chiara', coordinates:[0,11]},
        {name: 'Centro storico-Piedicastello', coordinates:[0,12]}
    ];

    tryout: eventType[];

    temChose: string[];
    sorChose: string[];
    coordinates: number[];

    distance: number = 5;
    value: number = 0;

    dist_active: number = 2; //0 = distance from position, 1 = distance from district, 2 = unactive
    isToggle1: boolean;
    isToggle2: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService,
        public storage: Storage, public utils: ConfigSrv, public modalCtrl: ModalController, public translate: TranslateService, public alertCtrl: AlertController) {
        
        this.storage.get('filterData')
            .then(filterData => {
                this.sorChose = filterData && filterData.sorChosen ? filterData.sorChosen : [];
                this.temChose = filterData && filterData.temChosen ? filterData.temChosen : [];
            });
            
        this.isToggle1 = false;
        this.isToggle2 = false;
    }

    filter(): void {
        let filterData = {
           temChosen: this.temChose,
           sorChosen: this.sorChose,
           posChosen: this.coordinates,
           disChosen: this.distance
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

    modal(theOrSor: number, s: string[]) {
        let modal;
        if(theOrSor == 1) {
            modal = this.modalCtrl.create(ModalPage, { 'theOrSor': theOrSor, 'List': this.temList, 'Chose': this.temChose });
        }
        else if(theOrSor == 0) {
            modal = this.modalCtrl.create(ModalPage, { 'theOrSor': theOrSor, 'List': this.sorList, 'Chose': this.sorChose });
        }
        else {
            modal = this.modalCtrl.create(ModalPage, { 'theOrSor': theOrSor, 'List': this.disList, 'Chose': this.coordinates });
        }

        modal.onDidDismiss( (Chose: any) => { 
            if(theOrSor == 1) {
                if(Chose != null) {
                    this.temChose = Chose;
                }
            } 
            else if(theOrSor == 0) {
                if(Chose != null) {
                    this.sorChose = Chose;
                }
            }
            else {
                if(Chose != null) {
                    this.disList.forEach(element => {
                        if(Chose == element.name) {
                            this.coordinates = element.coordinates;
                        }
                    });
                }
            }
            console.log(this.coordinates);
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

    dist(dist : number) {
        if(dist == 0 && this.dist_active == 0) {
            this.isToggle2 = false;
            this.dist_active = 2;
        }
        else if(dist == 1 && this.dist_active == 1) {
            this.isToggle1 = false;
            this.dist_active = 2;
        }
        else if(dist == 0 && this.dist_active != 0) {
            this.isToggle2 = true;
            this.dist_active = 0;
        }
        else if(dist == 1 && this.dist_active != 1) {
            this.isToggle1 = true;
            this.dist_active = 1;
        }
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