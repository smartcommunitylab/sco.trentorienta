import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { ElementListPage } from '../elementList/elementList';
import { eventType } from '../../app/struct-data';


@Component({
  selector: 'page-home',
  templateUrl: '../elementList/elementList.html'
})
export class HomePage extends ElementListPage {
    title =  "Home";

    getData(from: number, to: number): Promise<eventType[]> {
      return this.eventService.getEvents(from ,to);
    }
}
