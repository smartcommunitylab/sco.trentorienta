import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';

@Component({
    selector: 'page-elementDetails',
    templateUrl: 'elementDetails.html',
    providers: [EventService]
})

export class ElementDetailsPage implements OnInit {
    event: eventType;
    //dateEvent: any;
    //createEvent: any;
    isFav: boolean = false;
    url: string;

    constructor(private eventService: EventService, public navParams: NavParams,
        public storage: Storage, public loadingCtrl: LoadingController, public translate: TranslateService) {

    }

    checkIndex(b: eventType[], e: eventType): number {
        let a = -1;
        b.forEach(evento => {
            if (evento.id == e.id) {
                a = b.indexOf(evento);
            }
        });
        return a;
    }

    addFav(event: eventType) {
        this.isFav = !this.isFav;
        if (this.isFav) {
            this.storage.get('favourites').then(favourites => {
                let a = this.checkIndex(favourites, event);
                if (a < 0) {
                    favourites.push(event);
                }
                this.storage.set('favourites', favourites);
            });
        } else {
            this.storage.get('favourites').then(favourites => {
                let a = this.checkIndex(favourites, event);
                if (a >= 0) {
                    favourites.splice(a, 1);
                }
                this.storage.set('favourites', favourites);
            });
        }
    }

    onSelect(a: eventType): void {
        console.log(a.description);
    }

    ngOnInit(): void {
        let loading = this.loadingCtrl.create({
            content: this.translate.instant('lbl_wait') + '...'
        });
        loading.present();
        this.eventService.getEvent(this.navParams.get('id'))
            .then(event => {
                loading.dismiss();

                this.event = event;
                console.log(this.event); //DEBUGGING
                this.event.eventoDate = moment(this.event.eventStart, 'YYYYMMDDHHmm');
                this.event.createdDate = moment(this.event.created, 'YYYYMMDDHHmm').format('DD.MM.YYYY');
                if (event.address) {
                    this.url = "https://www.google.it/maps/search/?api=1&query=" + event.address;
                } else {
                    this.url = "https://www.google.it/maps/search/?api=1&query=" + event.coordX + "," + event.coordY;
                }
                this.storage.get('favourites').then(favourites => {
                    if (favourites == null) {
                        favourites = [];
                        this.storage.set('favourites', favourites).then(favourites => {
                            let a = this.checkIndex(favourites, event);
                            if (a != -1) {
                                this.isFav = true;
                            }
                        })
                    } else {
                        let a = this.checkIndex(favourites, event);
                        if (a != -1) {
                            this.isFav = true;
                        }
                    }
                })
            });
    }
}