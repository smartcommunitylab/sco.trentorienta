import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { occurenciesType } from '../../app/struct-data';
import { TemiListPage } from '../temiList/temiList';

@Component({
  selector: 'page-temi',
  templateUrl: 'temi.html'
})
export class TemiPage implements OnInit{
  title: string = 'Temi';
  modeList : string = 'lista';
  
  themeType : occurenciesType[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService) {

  }
  
  getThemes():void{
    this.eventService.getThemesList()
      .then(themeType => 
      {this.themeType = this.themeType.concat(themeType)})
  }

  ngOnInit(): void{
    this.getThemes();
  }

  onSelect(theme: occurenciesType): void{
      this.navCtrl.push(TemiListPage, {name: theme.name} )
  }
}
