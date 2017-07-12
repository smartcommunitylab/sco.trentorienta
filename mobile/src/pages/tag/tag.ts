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
  selectedTag : occurenciesType;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService) {

  }
  
  getTags():void{
    this.eventService.getTagsList()
      .then(tagType => 
      {this.tagType = this.tagType.concat(tagType)})
  }

  ngOnInit(): void{
    this.getTags();
  }

  onSelect(tag: occurenciesType): void{
      this.selectedTag = tag;
      this.navCtrl.push(TagListPage, {name: this.selectedTag.name} )
  }
}
