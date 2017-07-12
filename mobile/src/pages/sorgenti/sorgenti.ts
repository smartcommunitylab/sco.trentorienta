import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { occurenciesType } from '../../app/struct-data';
import { SorgentiListPage } from '../sorgentiList/sorgentiList';

@Component({
  selector: 'page-sorgenti',
  templateUrl: 'sorgenti.html'
})
export class SorgentiPage implements OnInit{
  title: string = 'Sorgenti';
  modeList : string = 'lista';
  sourceType : occurenciesType[] = [];
  selectedSource : occurenciesType;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService) {

  }
  
  getSources():void{
    this.eventService.getSourcesList()
      .then(sourceType => 
      {this.sourceType = this.sourceType.concat(sourceType)})
  }

  ngOnInit(): void{
    this.getSources();
  }

  onSelect(source: occurenciesType): void{
      this.selectedSource = source;
      this.navCtrl.push(SorgentiListPage, {name: this.selectedSource.name} )
  }
}
