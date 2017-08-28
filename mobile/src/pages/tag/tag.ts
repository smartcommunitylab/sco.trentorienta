import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EventService } from '../../app/event-service';
import { occurenciesType } from '../../app/struct-data';
import { TagListPage } from '../tagList/tagList';

@Component({
  selector: 'page-tag',
  templateUrl: 'tag.html'
})
export class TagPage implements OnInit{
  title: string = 'Tags';
  modeList : string = 'lista';
  
  tagType : occurenciesType[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService) {

  }
  
  getTags():void{
    this.eventService.getTagsList()
      .then(tagType => 
      {this.tagType = this.tagType.concat(tagType)})
  }

  doRefresh(refresher) {
    console.log('tag list refresh', refresher);
    this.tagType = [];
    setTimeout( ()=> {
        this.getTags();
        refresher.complete();
    });
    
}

  ngOnInit(): void{
    this.getTags();
  }

  onSelect(tag: occurenciesType): void{
      this.navCtrl.push(TagListPage, {name: tag.name} )
  }
}
