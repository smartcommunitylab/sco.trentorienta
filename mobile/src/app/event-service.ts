import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { eventType } from './struct-data';
import { occurenciesType } from './struct-data';

@Injectable()
export class EventService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private eventsUrl = 'api/mainEvents';  // URL to web api

  constructor(private http: Http) { }

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

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}