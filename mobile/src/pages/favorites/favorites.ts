import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

import { EventService } from '../../app/event-service';
import { eventType, occurenciesType} from '../../app/struct-data';
import { ElementDetailsPage } from '../elementDetails/elementDetails';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})

export class FavoritesPage{
  title: string = 'Favorites';
  favList: eventType[] = [];
  sourceFavList: occurenciesType[] = [];

  constructor(public eventService: EventService, public navCtrl: NavController, public storage: Storage){
    
  }
  
  checkIndex(b: eventType[], e: eventType): number{
    let a = -1;
        b.forEach(evento => {
            if(evento.id == e.id){
                a = b.indexOf(evento);
            }
        });
    return a;
  }

  ionViewWillEnter() {
    this.getFavs();
    this.getSourceFavs();
  }

  onSelect(event: eventType){
    this.navCtrl.push(ElementDetailsPage, {id: event.id} )
  }

  remove(event: eventType){
    this.storage.get('favourites')
      .then(favourites => {
          let a = this.checkIndex(favourites, event);
          if(a >= 0){
              favourites.splice(a, 1);
          }
          this.storage.set('favourites', favourites)
            .then(favourites => {
              this.getFavs();
            })
      });
  }

  getFavs(){
    this.eventService.favoriteEvents()
      .then(events => {
        this.favList = events;
        this.favList.forEach(event => {
          event.eventoDate = moment(event.eventDate, 'YYYYMMDDHHmmss').toDate();
          event.createdDate = moment(event.created, 'YYYYMMDDHHmmss').toDate();          
        });
      });
  }

  getSourceFavs(){
    this.eventService.sourceFavorites()
      .then(sources => {
        this.sourceFavList = sources;
      });
  }
}
