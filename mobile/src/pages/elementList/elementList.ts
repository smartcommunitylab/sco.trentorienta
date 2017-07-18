import { Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import * as moment from 'moment';

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
    view: string = "lista";

    mainEvents : eventType[] = [];
    calendarEvents = null;
    calendarSize: number = 0;
    selectedEvent : eventType;
    searching: boolean = false;
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



    constructor(protected eventService: EventService, public navCtrl: NavController, public alertCtrl: AlertController){
        
    }

    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
        this.getEvents(false, infiniteScroll);
    }

    doInfiniteCal(infiniteScroll) {
        console.log('Begin async operation');
        this.loadCalendar(infiniteScroll);
    }

    abstract getData(from: number, to: number, filter: string): Promise<eventType[]>;

    abstract getCalData(from:number, to:number): Promise<eventType[]>;

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
 
    loadCalendar(infiniteScroll?: any): void{
        if (this.calendarEvents == null) {
            this.calendarEvents = {};
        }   
        let from = this.calendarSize;
        this.getCalData(from,  from + this.PAGE_SIZE)
            .then(events => {
                this.calendarSize += events.length;
                events.forEach(event => {
                    var date = moment(event.eventDate, "YYYYMMDDHHmmss").format("DD.MM.YYYY");
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
        
        let indexMap = {0:0};
        let commonPlace = {0:[this.mainEvents[0]]};
        for (let i = 0; i < this.mainEvents.length; i++) {
            let evento = this.mainEvents[indexMap[i]];
            for(let j = i + 1; j < this.mainEvents.length; j++){
                // if (indexMap[j] != null) continue;
                
                let evento2 = this.mainEvents[j];
                let dis = this.distance(evento.coordX, evento.coordY, evento2.coordX, evento2.coordY);
                if(dis<=50){
                    commonPlace[indexMap[i]].push(evento2);
                    indexMap[j]=indexMap[i];
                } else {
                    commonPlace[j]=[evento2];
                    indexMap[j]=j;
                }
                //misura distanza tra j e indexmap[i]
                //se la distanza e' piccola aggiungi j a commonplace[indexmap[i]]
                //mappa j su indexmap[i]
                //else
                //aggiungi j a un nuovo indexmap e commonplace PROPRIO
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
                alert.setTitle('Eventi');
                
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
        console.log(indexMap);
        console.log(commonPlace);
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
        this.selectedEvent = event;
        this.navCtrl.push(ElementDetailsPage, {id: this.selectedEvent.id} )
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
    