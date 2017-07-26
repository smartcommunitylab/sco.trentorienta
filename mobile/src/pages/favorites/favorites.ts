import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';

import { EventService } from '../../app/event-service';
import { eventType, occurenciesType} from '../../app/struct-data';
import { ElementDetailsPage } from '../elementDetails/elementDetails';
import { SorgentiListPage } from '../sorgentiList/sorgentiList';
import { TemiListPage } from '../temiList/temiList';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})

export class FavoritesPage{
  title: string = 'Favorites';
  
  favList: eventType[] = [];
  sourceFavList: occurenciesType[] = [];
  themesFavList: occurenciesType[] = [];

  eventPop: boolean = false;
  sourcePop: boolean = false;
  themePop: boolean = false;

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

  checkIndexOcc(b: occurenciesType[], e: occurenciesType): number{
    let a = -1;
        b.forEach(evento => {
            if(evento.name == e.name){
                a = b.indexOf(evento);
            }
        });
    return a;
  }

  ionViewWillEnter() {
    this.getFavs();
    this.getSourceFavs();
    this.getThemeFavs();
  }

  onSelect(event: eventType){
    this.navCtrl.push(ElementDetailsPage, {id: event.id} )
  }

  onSelectSource(source: occurenciesType){
      this.navCtrl.push(SorgentiListPage, {name: source.name, sor: source} )
  }

  onSelectTheme(theme: occurenciesType){
    this.navCtrl.push(TemiListPage, {name: theme.name, tem: theme} )
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

  removeSource(source: occurenciesType){
    this.storage.get('sorFavs')
      .then(sources => {
          let a = this.checkIndexOcc(sources, source);
          if(a >= 0){
              sources.splice(a, 1);
          }
          this.storage.set('sorFavs', sources)
            .then(sources => {
              this.getSourceFavs();
            })
      });
  }

  removeTheme(theme: occurenciesType){
    this.storage.get('themeFavs')
      .then(themes => {
          let a = this.checkIndexOcc(themes, theme);
          if(a >= 0){
              themes.splice(a, 1);
          }
          this.storage.set('themeFavs', themes)
            .then(themes => {
              this.getThemeFavs();
            })
      });
  }

  popEvent(){
    this.eventPop = !this.eventPop;
  }

  popSource(){
    this.sourcePop = !this.sourcePop;
  }

  popTheme(){
    this.themePop = !this.themePop;
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

  getThemeFavs(){
    this.eventService.themeFavorites()
      .then(themes => {
        this.themesFavList = themes;
      })
  }
}
