import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { eventType, occurenciesType} from './struct-data';

@Injectable()
export class EventService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private eventsUrl = 'api/mainEvents';  // URL to web api

  constructor(private http: Http, public storage: Storage) { }

  // Returns all events in an array (optional from - to for pages)
  getEvents(from=0, to=65535): Promise<eventType[]> {
    return this.http.get(this.eventsUrl)
            .toPromise()
            .then(response => (response.json().data as eventType[]).slice(from, to + 1)
                )
            .catch(this.handleError);
  }


  getEvent(id: number): Promise<eventType> {
    const url = `${this.eventsUrl}/${id}`;
    return this.http.get(url)
    .toPromise()
    .then(response => response.json().data as eventType)
    .catch(this.handleError);
  }

  // Retreive number of events
  getNumberOfEvents(): Promise<number> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[]).length);
  }

  // Returns all events filtered by tag
  getEventsByTag(filterTag: string, from = 0, to = 65535): Promise<eventType[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[]).filter
                    (function(value:eventType) {return value.tags.indexOf(filterTag) >= 0 })
                    .slice(from, to + 1))
                .catch(this.handleError);
  }

  // Returns all events filtered by source
  getEventsBySource(filterSource: string, from = 0, to = 65535): Promise<eventType[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[]).filter
                    (function(value:eventType) {return value.source.localeCompare(filterSource) == 0 })
                    .slice(from, to + 1))
                .catch(this.handleError);
  }

  // Returns all events filtered by theme
  getEventsByTheme(filterTheme: string, from = 0, to = 65535): Promise<eventType[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[]).filter
                    (function(value:eventType) {return value.themes.indexOf(filterTheme) >= 0 })
                    .slice(from, to + 1))
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
    let c = moment(b,'YYYYMMDDHHmmss').format('YYYY.MM.DD');
    if(a == c){
        return true;
    } else {
        return false;
    } 
  }

  searchEvents(filter: string, from = 0, to = 65535, theme?: string[], tag?: string, source?: string[], date?: string, fav?: boolean): Promise<eventType[]> {
      return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[])
                    .filter(value => {
                        return (filter ? value.title.toLowerCase().match(filter.toLowerCase()) : true)
                            && (theme ?  this.intersect(value.themes,theme) : true)
                            && (tag ? value.tags.indexOf(tag) >= 0 : true)
                            && (source ? this.intersectSource(value.source,source) : true)
                            && (date ?  this.intersectDate(date, value.eventDate) : true)
                            //&& (fav ?  -PRENDI IL VALORE DELLA CHIAVE DI VALUE.TITLE- : true)
                    })
                    .slice(from, to + 1))
                    .catch(this.handleError);    
  }

  // Returns all available tags
  getTagsList(): Promise<occurenciesType[]> {
    return this.http.get(this.eventsUrl)
            .toPromise()
            .then(response => {
                    let map = (response.json().data as eventType[])
                    .map(function(e: eventType) {return e.tags;})
                    .reduce(function (acc, curr) {   // per contare le occorrenze
                        curr.forEach(t => {
                            if (typeof acc[t] == 'undefined') {
                                acc[t] = 1;
                            } else {
                                acc[t] += 1;
                            }
                        });
                        return acc;
                    }, {});
                    let res: occurenciesType[] = [];
                    for (let key in map) {
                        res.push({name: key, count: map[key]});
                    }
                    return res;
                })
                .catch(this.handleError);
  }

  // Returns all available themes
  getThemesList(): Promise<occurenciesType[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => {
                    let map = (response.json().data as eventType[])
                    .map(function(e: eventType) {return e.themes;})
                    .reduce(function (acc, curr) {   // per contare le occorrenze
                        curr.forEach(t => {
                            if (typeof acc[t] == 'undefined') {
                                acc[t] = 1;
                            } else {
                                acc[t] += 1;
                            }
                        });
                        return acc;
                    }, {});
                    let res: occurenciesType[] = [];
                    for (let key in map) {
                        res.push({name: key, count: map[key]});
                    }
                    return res;
                })
                .catch(this.handleError);
  }

  // Returns all available sources
  getSourcesList(): Promise<occurenciesType[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => {
                    let map = (response.json().data as eventType[])
                    .map(function(e: eventType) {return e.source;})
                    .reduce(function (acc, curr) {   // per contare le occorrenze
                        if (typeof acc[curr] == 'undefined') {
                            acc[curr] = 1;
                        } else {
                            acc[curr] += 1;
                        }
                        return acc;
                    }, {});
                    let res: occurenciesType[] = [];
                    for (let key in map) {
                        res.push({name: key, count: map[key]});
                    }
                    return res;
                })
                .catch(this.handleError);
  }

  calendarEvents(from=0, to=65535, theme?: string[], tag?: string, source?: string[], date?: string):Promise<eventType[]>{
      return this.searchEvents(null, 0, 65535, theme, tag, source, date).then(events => {
          return events.sort((a,b) => {return parseInt(a.eventDate) - parseInt(b.eventDate);}).splice(from, to+1);
      });
    // return this.http.get(this.eventsUrl)
    //             .toPromise()
    //             .then(response => (response.json().data as eventType[])
    //             .sort((a,b) => {return parseInt(a.eventDate) - parseInt(b.eventDate);})
    //             )
    //             .catch(this.handleError)
  }

  favoriteEvents(from=0, to=65535):Promise<eventType[]>{
    return this.searchEvents(null, 0, 65535, null, null, null, null, true)
            .then(events => {
                return events.splice(from, to+1);
            });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}