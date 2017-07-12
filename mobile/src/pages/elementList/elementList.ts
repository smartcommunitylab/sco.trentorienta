import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { eventType } from '../../app/struct-data';
import { ElementDetailsPage } from '../elementDetails/elementDetails';

import { Observable }     from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
 
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'page-elementList',
  templateUrl: 'elementList.html',
  providers: [EventService]
})

export abstract class ElementListPage implements OnInit{
    view: string = "lista";
    mainEvents : eventType[] = [];
    selectedEvent : eventType;
    searching: boolean = false;
    private searchTerms = new Subject<string>();
    private termsObs: Observable<string>;
    private searchValue: string = null;

    title = "ElementList";

    // size of a chunk of data to load
    readonly PAGE_SIZE = 10;

    constructor(protected eventService: EventService, public navCtrl: NavController){
        
    }

    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        this.getEvents(false, infiniteScroll);
    }

    abstract getData(from: number, to: number, filter: string): Promise<eventType[]>;

    getEvents(reset: boolean, infiniteScroll?: any): void {
        let from = reset ? 0 : this.mainEvents.length;
        this.getData(from, from + this.PAGE_SIZE, this.searchValue)
            .then(mainEvents => {
                this.mainEvents = reset ? mainEvents : this.mainEvents.concat(mainEvents);
                if (infiniteScroll != null) {
                    if(mainEvents == null || mainEvents.length == 0){
                        infiniteScroll.enable(false);
                    }
                    infiniteScroll.complete();
                }                    
            });
    }
 
    toggleSearch():void{
        this.searching= !this.searching;
    }

    search(filter: string): void {
        this.searchTerms.next(filter);
    }

    ngOnInit(): void{
        this.getEvents(false);
        this.termsObs = this.searchTerms
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged();

        this.termsObs.forEach(v => {
            this.searchValue = v;
            this.getEvents(true);
        });
    }

    onSelect(event: eventType): void{
        this.selectedEvent = event;
        this.navCtrl.push(ElementDetailsPage, {id: this.selectedEvent.id} )
    }
}