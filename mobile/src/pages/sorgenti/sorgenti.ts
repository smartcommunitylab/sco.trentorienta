import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventService: EventService, public storage: Storage, public toastCtrl: ToastController) {

  }

  checkIndex(b: occurenciesType[], e: occurenciesType): number{
    let a = -1;
        b.forEach(evento => {
            if(evento.name == e.name){
                a = b.indexOf(evento);
            }
        });
    return a;
  }

  cap(a: string): string{
    return a.charAt(0).toUpperCase() + a.slice(1);
  }
  
  addFav(source: occurenciesType){
    source.fav = !source.fav;
    if(source.fav){
      this.storage.get('sorFavs').then(sorFavs => {
          let a = this.checkIndex(sorFavs, source);
          if(a < 0){
              sorFavs.push(source);
              let toast = this.toastCtrl.create({
                message: '"' + this.cap(source.name) + '" é stato aggiunto ai preferiti',
                duration: 1500,
                position: 'middle',
              })
              toast.present();
          }
          this.storage.set('sorFavs', sorFavs);
      });
    } else {
      this.storage.get('sorFavs').then(sorFavs => {
          let a = this.checkIndex(sorFavs, source);
          if(a >= 0){
              sorFavs.splice(a, 1);
          }
          this.storage.set('sorFavs', sorFavs);
      });
    }
  }
  
  getSources(): void{
    this.eventService.getSourcesList()
      .then(sourceType => {
        this.sourceType = this.sourceType.concat(sourceType);
        this.storage.get('sorFavs').then(sorFavs =>{
          if(sorFavs == null){
            sorFavs = [];
            this.storage.set('sorFavs', sorFavs);
          } else {
            sorFavs.forEach(source => {
              let a = this.checkIndex(sorFavs, source);
              if(a >= 0){
                let b = this.checkIndex(this.sourceType, source);
                this.sourceType[b].fav = true;
              }
            })
          }
        })
      })
  }

  ngOnInit(): void{
    this.getSources();
  }

  onSelect(source: occurenciesType): void{
      this.navCtrl.push(SorgentiListPage, {name: source.name} )
  }
}
