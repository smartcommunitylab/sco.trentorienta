import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../app/event-service';
import { ElementListPage } from '../elementList/elementList';
import { eventType, occurenciesType } from '../../app/struct-data';
import { FilterPage } from '../filter/filter';


@Component({
    selector: 'page-home',
    templateUrl: '../elementList/elementList.html'
})
export class HomePage extends ElementListPage {
    title = "Home";

    constructor(protected eventService: EventService, public navCtrl: NavController, public modalCtrl: ModalController,
        public navParams: NavParams, public storage: Storage, public loadingCtrl: LoadingController, public translate: TranslateService) {
        super(eventService, navCtrl, modalCtrl, storage, loadingCtrl, translate);
        this.isHome = true;

    }

    getData(from: number, to: number, filter: string): Promise<eventType[]> {
        return this.storage.get('filterData')
            .then(filterData => {
                return this.eventService.searchEvents(filter, from, to, filterData && filterData.temChosen ? filterData.temChosen : [], null, filterData && filterData.sorChosen ? filterData.sorChosen : [])
            })
    }

    getCalData(from: number, to: number, data?: string): Promise<eventType[]> {
        return this.storage.get('filterData')
            .then(filterData => {
                return this.eventService.calendarEvents(from, to, filterData && filterData.temChosen ? filterData.temChosen : [], null, filterData && filterData.sorChosen ? filterData.sorChosen : [], data)
            })
    }
}