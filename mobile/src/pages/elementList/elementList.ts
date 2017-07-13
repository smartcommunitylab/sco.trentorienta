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

    map: L.Map; // points to leaflet map

    // onMapReady: called when leaflet map is drawn.
    // Resolves a bug vith gray maps (when I change segment page...)
    onMapReady(map: L.Map) {
        // remvoe ALL layers
        map.eachLayer(layer => (map.removeLayer(layer)));

        // re-add the background layer
        map.addLayer (this.options.layers[1]);

        // I create a group of markers, so I can view all markers in the map
        var group = L.featureGroup();

        for (var i = 0; i < this.mainEvents.length; i++) {
            var evento = this.mainEvents[i];
            if (evento)  {
                let marker = L.marker([ evento.coordX, evento.coordY ], {
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
            }
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
}

export class LeafletCoreDemoModel {
    
        constructor(
            public latitude: number = 0,
            public longitude: number = 0,
            public zoom: number = 4,
            public zoomLevels: number[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 ]
        ) { }
    
    }
    