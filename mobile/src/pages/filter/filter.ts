import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';

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
        {name: 'Gardolo', coordinates:[46.1069, 11.1121]}, 
        {name: 'Meano', coordinates:[46.1247, 11.1173]},
        {name: 'Bondone', coordinates:[45.8074, 10.5513]},
        {name: 'Sardagna', coordinates:[46.063508, 11.096803]},
        {name: 'Ravina-Romagnano', coordinates:[46.01807, 11.10563]},
        {name: 'Cognola', coordinates:[46.076389, 11.141944]},
        {name: 'Povo', coordinates:[46.06698, 11.15503]},
        {name: 'Mattarello', coordinates:[46.0085, 11.1304]},
        {name: 'Villazzano', coordinates:[46.066667, 11.150000]},
        {name: 'Oltrefersina', coordinates:[46.0085, 11.1304]},
        {name: 'Giuseppe S.Chiara', coordinates:[46.065149, 11.124435]},
        {name: 'Centro storico-Piedicastello', coordinates:[46.071018, 11.113013]}
    ];

    tryout: eventType[];

    temChose: string[];
    sorChose: string[];
    coordinates: number[];

    distance: number = 5;
    value: number = 0;

    dist_active: number = 2; //0 = distance from position, 1 = distance from district, 2 = unactive

    isUnactive1: boolean = false;
    isUnactive2: boolean = false;

    isToggle1: boolean = false;
    isToggle2: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService,
        public storage: Storage, public utils: ConfigSrv, public modalCtrl: ModalController, public translate: TranslateService, public alertCtrl: AlertController, public geolocation: Geolocation) {
        
        this.storage.get('filterData')
            .then(filterData => {
                this.sorChose = filterData && filterData.sorChosen ? filterData.sorChosen : [];
                this.temChose = filterData && filterData.temChosen ? filterData.temChosen : [];
                this.coordinates = filterData && filterData.posChosen ? filterData.posChosen : [];
                this.distance = filterData && filterData.disChosen ? filterData.disChosen : [];

                switch (this.distance) { //set the initial value of the range
                    case 5:
                        this.value = 0;
                        break;
                    case 10:
                        this.value = 1;
                        break;
                    case 20:
                        this.value = 2;
                        break;
                    case 50:
                        this.value = 3;
                        break;
                    case 100:
                        this.value = 4;
                        break;
                }
            });
    }

    filter(): void {
        if(this.isToggle1) {
            this.geolocation.getCurrentPosition().then((resp) => {
                this.coordinates = [resp.coords.latitude, resp.coords.longitude];
               }).catch((error) => {
                 this.coordinates = [46.072559, 11.119443];
               });
        }
        else if (!this.isToggle2) {
            this.coordinates = [];
        }
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

        modal.onDidDismiss( (Chose: any[]) => { 
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
                    this.coordinates = Chose;
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
            this.isUnactive2 = false;
            this.dist_active = 2;
        }
        else if(dist == 1 && this.dist_active == 1) {
            this.isUnactive1 = false;
            this.dist_active = 2;
        }
        else if(dist == 0 && this.dist_active != 0) {
            this.isUnactive2 = true;
            this.dist_active = 0;
        }
        else if(dist == 1 && this.dist_active != 1) {
            this.isUnactive1 = true;
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