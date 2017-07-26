import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  
  addFav(theme: occurenciesType){
    theme.fav = !theme.fav;
    if(theme.fav){
      this.storage.get('themeFavs').then(themeFavs => {
          let a = this.checkIndex(themeFavs, theme);
          if(a < 0){
              themeFavs.push(theme);
              let toast = this.toastCtrl.create({
                message: '"' + this.cap(theme.name) + '" é stato aggiunto ai preferiti',
                duration: 1500,
                position: 'middle',
              })
              toast.present();
          }
          this.storage.set('themeFavs', themeFavs);
      });
    } else {
      this.storage.get('themeFavs').then(themeFavs => {
          let a = this.checkIndex(themeFavs, theme);
          if(a >= 0){
              themeFavs.splice(a, 1);
          }
          this.storage.set('themeFavs', themeFavs);
      });
    }
  }
  
  getThemes(): void{
    this.eventService.getThemesList()
      .then(themeType => {
        this.themeType = this.themeType.concat(themeType);
        this.storage.get('themeFavs').then(themeFavs =>{
          if(themeFavs == null){
            themeFavs = [];
            this.storage.set('themeFavs', themeFavs);
          } else {
            themeFavs.forEach(theme => {
              let a = this.checkIndex(themeFavs, theme);
              if(a >= 0){
                let b = this.checkIndex(this.themeType, theme);
                this.themeType[b].fav = true;
              }
            })
          }
        })
      })
  }

  ngOnInit(): void{
    this.getThemes();
  }

  onSelect(theme: occurenciesType): void{
      this.navCtrl.push(TemiListPage, {name: theme.name} )
  }
}
