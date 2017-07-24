import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { eventType, occurenciesType} from '../../app/struct-data';
import { ElementDetailsPage } from '../elementDetails/elementDetails';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})

export class FavoritesPage implements OnInit{
  title: string = 'Favorites';
  favList: eventType[] = [];

  constructor(public eventService: EventService){
    
  }
  
  ngOnInit(){
    this.eventService.favoriteEvents()
      .then(events => this.favList = events);
  }
}
