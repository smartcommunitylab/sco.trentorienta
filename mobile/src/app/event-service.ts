import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { eventType } from './struct-data';

@Injectable()
export class EventService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private eventsUrl = 'api/mainEvents';  // URL to web api

  constructor(private http: Http) { }

  // Returns all events in an array (optional from - to for pages)
  getEvents(from=0, to=65535): Promise<eventType[]> {

    return this.http.get(this.eventsUrl)
            .toPromise()
            .then(response => response.json().data as eventType[]).slice(from, to + 1)
            .catch(this.handleError);
  }

  // Retreive number of events
  getNumberOfEvents(): Promise<number> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[]).length);
  }

  // Returns all events filtered by tag
  getEventsByTag(filterTag: string): Promise<eventType[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[]).filter
                    (function(value:eventType) {return value.tags.localeCompare(filterTag) == 0 }))
                .catch(this.handleError);
  }

  // Returns all events filtered by source
  getEventsBySource(filterSource: string): Promise<eventType[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[]).filter
                    (function(value:eventType) {return value.source.localeCompare(filterSource) == 0 }))
                .catch(this.handleError);
  }

  // Returns all events filtered by theme
  getEventsByTheme(filterTheme: string): Promise<eventType[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[]).filter
                    (function(value:eventType) {return value.themes.localeCompare(filterTheme) == 0 }))
                .catch(this.handleError);
  }

  // Returns all available tags
  getTagsList(): Promise<string[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[])
                    .map(function(e: eventType) {return e.tags;})
                    .filter(function (value, index, self) { return self.indexOf(value) === index; } ))
                .catch(this.handleError);
  }

  // Returns all available themes
  getThemesList(): Promise<string[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[])
                    .map(function(e: eventType) {return e.themes;})
                    .filter(function (value, index, self) { return self.indexOf(value) === index; } ))
                .catch(this.handleError);
  }

  // Returns all available sources
  getSourcesList(): Promise<string[]> {
    return this.http.get(this.eventsUrl)
                .toPromise()
                .then(response => (response.json().data as eventType[])
                    .map(function(e: eventType) {return e.source;})
                    .filter(function (value, index, self) { return self.indexOf(value) === index; } ))
                .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}