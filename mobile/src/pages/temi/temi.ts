import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { EventService } from '../../app/event-service';
import { occurenciesType } from '../../app/struct-data';
import { TemiListPage } from '../temiList/temiList';

@Component({
  selector: 'page-temi',
  templateUrl: 'temi.html'
})
export class TemiPage implements OnInit {
  title: string = 'Temi';
  modeList: string = 'lista';

  themeType: occurenciesType[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private eventService: EventService, public storage: Storage, public loadingCtrl: LoadingController, public translate: TranslateService) {

  }

  checkIndex(b: occurenciesType[], e: occurenciesType): number {
    let a = -1;
    b.forEach(evento => {
      if (evento.name == e.name) {
        a = b.indexOf(evento);
      }
    });
    return a;
  }

  getThemes(): void {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('lbl_wait') + '...'
    });
    loading.present();
    this.eventService.getThemesList()
      .then(themeType => {
        loading.dismiss();
        this.themeType = this.themeType.concat(themeType);
        this.storage.get('themeFavs').then(themeFavs => {
          if (themeFavs == null) {
            themeFavs = [];
            this.storage.set('themeFavs', themeFavs);
          } else {
            themeFavs.forEach(theme => {
              let a = this.checkIndex(themeFavs, theme);
              if (a >= 0) {
                let b = this.checkIndex(this.themeType, theme);
                this.themeType[b].fav = true;
              }
            })
          }
        })
      })
  }

  ngOnInit(): void {
    this.getThemes();
  }

  onSelect(theme: occurenciesType): void {
    this.navCtrl.push(TemiListPage, { name: theme.name, tem: theme })
  }
}
