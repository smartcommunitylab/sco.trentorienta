import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { ElementListPage } from '../elementList/elementList';


@Component({
  selector: 'page-home',
  templateUrl: '../elementList/elementList.html'
})
export class HomePage extends ElementListPage{
    title =  "Home";

    
}
