import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { NavController, AlertController, Content } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

import { EventService } from '../../app/event-service';
import { eventType, occurenciesType } from '../../app/struct-data';
import { ElementDetailsPage } from '../elementDetails/elementDetails';
import { FilterPage } from '../filter/filter';

import { Observable }     from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
 
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Pipe({ name: 'ObjNgFor',  pure: false })
export class ObjNgFor implements PipeTransform {
    transform(value: any, args: any[] = null): any {
        return Object.keys(value)//.map(key => value[key]);
    }
}

@Component({
  selector: 'page-elementList',
  templateUrl: 'elementList.html',
  providers: [EventService]
})

export abstract class ElementListPage implements OnInit{
    @ViewChild(Content) content: Content;

    view: string = "lista";

    mainEvents : eventType[] = [];
    calendarEvents = null;
    calendarSize: number = 0;
    
    searching: boolean = false;
    tagging: boolean = false;
    isHome: boolean = false;
    isSor: boolean = false;
    isTheme: boolean = false;
    charged: boolean = false;
    hasDate: boolean = false;
    enabled: boolean = true;

    data: string[] = [];
    myDate: string;
    currDate: string;
    
    temList: occurenciesType[] = [];
    sorList: occurenciesType[] = [];


    private searchTerms = new Subject<string>();
    private termsObs: Observable<string>;
    private searchValue: string = null;

    title = "ElementList";

    // size of a chunk of data to load
    readonly PAGE_SIZE = 10;

    // per la mappa
	optionsSpec: {
		layers: any[],
		zoom: number,
		center: number[]
	} = {
		layers: [
			{
				url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
				maxZoom: 18,
				attribution: 'Open Cycle Map'
			},
			{
				url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				maxZoom: 18,
				attribution: 'Open Street Map'
			},
		],
		zoom: 12,
		center: [ 46.0, 11.1 ]
	};

	// Fields for managing the form inputs and binding to leaflet zoom/center
	model = new LeafletCoreDemoModel(
		this.optionsSpec.center[0],
		this.optionsSpec.center[1],
		this.optionsSpec.zoom
	);
	zoom: number;
	center: L.LatLng;

	/*
	 * This are the leaflet map options that we're going to use for input binding
	 */

	options = {
		layers: this.optionsSpec.layers.map((l) => {
			return L.tileLayer(l.url, { maxZoom: l.maxZoom, attribution: l.attribution });
		}),
		zoom: this.optionsSpec.zoom,
		center: L.latLng({ lat: this.optionsSpec.center[0], lng: this.optionsSpec.center[1] })
	};

	fitBoundsOptions = {
		padding: 100,
		maxZoom: 10,
		animate: true,
		duration: 1
	};

	panOptions = {
		animate: true,
		duration: 1
	};

	zoomOptions = {
		animate: true,
		duration: 1
	};

	zoomPanOptions = {
		animate: true,
		duration: 1
	};



    constructor(protected eventService: EventService, public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage){
        
    }

    ionViewWillEnter(){
        this.getEvents(true);
        this.enabled = true;
    }

    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        this.getEvents(false, infiniteScroll);
    }

    doInfiniteCal(infiniteScroll) {
        console.log('Begin async operation');
        this.loadCalendar(infiniteScroll);
    }

    doInfiniteDate(infiniteScroll, date: string) {
        console.log('Begin async operation');
        let d = moment(date).format('YYYY.MM.DD');
        console.log(d);
        this.loadCalendar(infiniteScroll, d);
    }

    abstract getData(from: number, to: number, filter: string): Promise<eventType[]>;

    abstract getCalData(from:number, to:number, data?: string): Promise<eventType[]>;

    getEvents(reset: boolean, infiniteScroll?: any): void {
        let from = reset ? 0 : this.mainEvents.length;
        this.getData(from, from + this.PAGE_SIZE, this.searchValue)
            .then(mainEvents => {
                if(reset == true && mainEvents.length < this.PAGE_SIZE){
                    this.enabled = false;
                }
                mainEvents.forEach(e => {
                    e.createdDate = moment(e.created, 'YYYYMMDDHHmmss').toDate();
                });
                this.mainEvents = reset ? mainEvents : this.mainEvents.concat(mainEvents);
                this.charged = true;
                if (infiniteScroll != null) {
                    if(mainEvents == null || mainEvents.length == 0){
                        this.enabled = false;
                    }
                    infiniteScroll.complete();
                }                    
            });
    }
 
    loadCalendar(infiniteScroll?: any, data?: string): void{
        if (this.calendarEvents == null) {
            this.calendarEvents = {};
        }   
        let from;
        if(data){
            if(infiniteScroll == null){
                from = 0;
                this.calendarSize = 0;
            } else {
                from = this.calendarSize;
            }
            this.hasDate = true;
        } else {
            from = this.calendarSize;
            this.hasDate = false;
        }
        this.getCalData(from,  from + this.PAGE_SIZE, data)
                .then(events => {
                    if(infiniteScroll == null && data){
                        this.calendarEvents = {};
                    }
                    this.calendarSize += events.length;
                    events.forEach(event => {
                        var date = moment(event.eventDate, "YYYYMMDDHHmmss").format("YYYY.MM.DD");
                        event.eventoDate = moment(event.eventDate, 'YYYYMMDDHHmmss').toDate();
                        event.createdDate = moment(event.created, 'YYYYMMDDHHmmss').toDate();
                        if (this.calendarEvents[date]) {
                            this.calendarEvents[date].push(event);
                        } else {
                            this.calendarEvents[date] = [event];
                        }
                    });
                    if (infiniteScroll != null) {
                        if(events == null || events.length == 0){
                            infiniteScroll.enable(false);
                        }
                        infiniteScroll.complete();
                    }
                });
    }

    distance(lat1: number,lon1: number,lat2: number,lon2: number):number {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d*1000;
    }

    deg2rad(deg: number):number{
        return deg * (Math.PI/180);
    }

    toggleSearch():void{
        this.searching = !this.searching;
        this.enabled = true;
        this.searchValue = "";
        this.searchTerms.next(this.searchValue);
    }

    // goBack():void{
    //     if(this.searching){
    //         this.toggleSearch();
    //     } else {
    //         this.storage.get('temChosen')
    //             .then(temChosen => {
    //                 this.storage.get('sorChosen')
    //                     .then(sorChosen => {
    //                         if(temChosen != null && sorChosen != null){
    //                             this.navCtrl.push(FilterPage)
    //                         }
    //                     })
    //             })
    //     }
    // }

    toggleFilters():void{
        this.navCtrl.push(FilterPage);
    }

    removeDate(): void{
        this.calendarSize = 0;
        this.calendarEvents = {};
        this.loadCalendar();
    }

    search(filter: string): void {
        this.searchTerms.next(filter);
    }

    scrolling(date: string){
        let scrollDate = moment(date).format('YYYY.MM.DD');
        this.loadCalendar(null, scrollDate);
    }

    ngOnInit(): void{
        this.myDate = new Date().toISOString();
        this.currDate = moment(new Date()).format('YYYY-MM-DD');
        this.termsObs = this.searchTerms
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged();

        this.termsObs.forEach(v => {
            this.searchValue = v;
            this.enabled = true;
            this.getEvents(true);
        });
        this.storage.set('temChosen', []);
        this.storage.set('sorChosen', []);
    }

    map: L.Map; // points to leaflet map

    // onMapReady: called when leaflet map is drawn.
    // Resolves a bug vith gray maps (when I change segment page...)
    onMapReady(map: L.Map) {
        // remove ALL layers
        map.eachLayer(layer => (map.removeLayer(layer)));

        // re-add the background layer
        map.addLayer (this.options.layers[1]);

        // I create a group of markers, so I can view all markers in the map
        let group = L.featureGroup();
        
        let commonPlace = {0:[this.mainEvents[0]]};
        for (let i = 0; i < this.mainEvents.length; i++) {
            let evento = this.mainEvents[i];
            let found = false;
            for(let j = 0; j < i; j++){        
                if (commonPlace[j] == null) continue;        

                let evento2 = this.mainEvents[j];
                let dis = this.distance(evento.coordX, evento.coordY, evento2.coordX, evento2.coordY);
                if(dis<=50){
                    commonPlace[j].push(evento);
                    found = true;
                    break;
                }
                //misura distanza tra j e indexmap[i]
                //se la distanza e' piccola aggiungi j a commonplace[indexmap[i]]
                //mappa j su indexmap[i]
                //else
                //aggiungi j a un nuovo indexmap e commonplace PROPRIO
            }
            if (!found) {
                commonPlace[i] = [evento];
            }
        }
        for(let key in commonPlace){
            let event = this.mainEvents[key];
            let marker = L.marker([event.coordX, event.coordY ], {
                icon: L.icon({
                    iconSize: [ 25, 41 ],
                    iconAnchor: [ 13, 41 ],
                    iconUrl: 'assets/icon/marker.png',
                    // shadowUrl: '44a526eed258222515aa21eaffd14a96.png'
                })
            });

            map.addLayer (
                marker
            );

            group.addLayer (
                marker
            );
            

            marker.addEventListener('click', evt => {
                let alert = this.alertCtrl.create();
                alert.setTitle('Eventi in questa zona');
                
                for(let event of commonPlace[key]){
                    alert.addButton({
                        text: event.title,
                        handler: (button) => {
                            this.onSelect(event);
                        }
                    });
                }

                alert.present();
            });
        }
        // zoom to all visible markers...
        map.fitBounds (group.getBounds());
    }

    switchSegment(segmentName: string) {
        // Mappa Leaflet
        // set up the map
	    // var map = new L.Map('map');
    
        if (segmentName == "mappa") {
            // create the tile layer with correct attribution
            // this.zoom = this.model.zoom;
            
            
                
            // }


            
        }

		return false;
    }

    onSelect(event: eventType): void{
        this.navCtrl.push(ElementDetailsPage, {id: event.id} )
    }

}

    


export class LeafletCoreDemoModel {
    
        constructor(
            public latitude: number = 0,
            public longitude: number = 0,
            public zoom: number = 4,
            public zoomLevels: number[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]
        ) { }
    
    }
    