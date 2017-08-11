import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ConfigSrv} from '../services/config-service'
import * as moment from 'moment';

// import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { eventType, occurenciesType} from './struct-data';

@Injectable()
export class EventService {

//   private headers = new Headers({'Content-Type': 'application/json'});
  // private eventsUrl = 'api/mainEvents';  // URL to web api
   private serverUrl = 'https://dev.smartcommunitylab.it/trentorienta/api/';
  // private serverUrl = 'http://localhost:8080/api/';
  //private serverUrl = 'http://192.168.95.82:8080/api/';

  constructor(private http: Http, public storage: Storage, public utils:ConfigSrv) {}

  // Returns all events in an array (optional from - to for pages)
  getEvents(from=0, to=65535): Promise<eventType[]> {
    return this.http.get(this.serverUrl + 'events', 
                { 
                    params:
                        {
                            start: from,
                            size: to-from
                        }
                }
            )
            .toPromise()
            .then(response => (response.json().content as eventType[])
                )
            .catch(this.handleError);
  }


  getEvent(id: string): Promise<eventType> {
    const url = this.serverUrl + 'event';
    return this.http.get(url, {
        params: {
            id: id
        }
    })
    .toPromise()
    .then(response => response.json() as eventType)
    .catch(this.handleError);
  }

  intersect(a: string[], b: string[]): boolean{
    for(let i = 0; i < a.length; i++){
        for(let j = 0; j < b.length; j++){
            if(a[i]==b[j]){
                return true;
            }
        }
    }
    return false;
  }

  intersectSource(a: string, b: string[]): boolean{
    for(let i = 0; i < b.length; i++){
        if(a==b[i]){
            return true;
        }
    }
    return false;
  }

  intersectDate(a: string, b: string): boolean{
    let c = moment(b,'YYYYMMDDHHmm').format('YYYY.MM.DD');
    if(a == c){
        return true;
    } else {
        return false;
    } 
  }

  searchEvents(filter: string, from = 0, to = 65535, theme?: string[], tag?: string[], source?: string[], date?: string, sortForList?: number): Promise<eventType[]> {

    if (sortForList == null)
        sortForList = 1;

    return this.http.post(this.serverUrl + 'events', {
                            start: from,
                            size: to-from,
                            source: source,
                            themes: theme,
                            tag: tag,
                            fromDate: date,
                            sortForList: sortForList,
                            filter: filter
                    })
                .toPromise()
                .then(response => (response.json().content as eventType[])).catch(this.handleError);    
  }

  // Returns all available tags
  getTagsList(): Promise<occurenciesType[]> {
    return this.http.get(this.serverUrl + 'tags')
                .toPromise()
                .then(response => {
                    let etichette = response.json();
                    let ret = [];
                    for (var key in etichette) {
                        ret.push ({name: key, count: etichette[key]});
                    }
                    return ret;
                })
                .catch(this.handleError);
  }

  // Returns all available themes
  getThemesList(): Promise<occurenciesType[]> {
    return this.http.get(this.serverUrl + 'themes')
                .toPromise()
                .then(response => {
                    let temi = response.json();
                    let ret = [];
                    for (var key in temi) {
                        ret.push ({name: key, count: temi[key]});
                    }
                    return ret;
                })
                .catch(this.handleError);
  }

  // Returns all available sources
  getSourcesList(): Promise<occurenciesType[]> {
    return this.http.get(this.serverUrl + 'sources')
                .toPromise()
                .then(response => {
                    let sorgenti = response.json();
                    let ret = [];
                    for (var key in sorgenti) {
                        ret.push ({name: key, count: sorgenti[key]});
                    }
                    return ret;
                })
                .catch(this.handleError);
  }

  calendarEvents(from=0, to=65535, theme?: string[], tag?: string[], source?: string[], date?: string):Promise<eventType[]>{
      if (date != null)  // data = 2019.01.01
        date = date.replace (/\./g, "") + "0000";  // data = 201901010000
      else{
          date = moment().format("YYYYMMDDHHmm");
      }

      return this.searchEvents(null, from, to+1, theme, tag, source, date, 0).then(events => {
          // return events.sort((a,b) => {return parseInt(a.eventDate) - parseInt(b.eventDate);}).splice(from, to+1);
          return events;
      });
    // return this.http.get(this.eventsUrl)
    //             .toPromise()
    //             .then(response => (response.json().data as eventType[])
    //             .sort((a,b) => {return parseInt(a.eventDate) - parseInt(b.eventDate);})
    //             )
    //             .catch(this.handleError)
  }

  favoriteEvents(from=0, to=65535):Promise<eventType[]>{
    return this.storage.get('favourites')
            .then(events => {
                if(events == null){
                    events = [];
                    this.storage.set('favourites', events).then(events =>{
                        return events;
                    })
                } else {
                    return events.splice(from, to+1);
                }
            });
  }

  sourceFavorites(from=0, to=65535):Promise<occurenciesType[]>{
    return this.storage.get('sorFavs')
            .then(sources => {
                if(sources == null){
                    sources = [];
                    this.storage.set('sorFavs', sources).then(sources =>{
                        return sources;
                    })
                } else {
                    return sources.splice(from, to+1);
                }
            });
  }

  themeFavorites(from=0, to=65535):Promise<occurenciesType[]>{
    return this.storage.get('themeFavs')
            .then(themes => {
                if(themes == null){
                    themes = [];
                    this.storage.set('themeFavs', themes).then(themes =>{
                        return themes;
                    })
                } else {
                    return themes.splice(from, to+1);
                }
            });
  }

  private handleError(error: any): Promise<any> {
      console.error('An error occurred', error); // for demo purposes only
      this.utils.presentErrorToast();
      return Promise.reject(error.message || error);
  }
}