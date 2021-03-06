import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

import { EventService } from '../../app/event-service';
import { occurenciesType } from '../../app/struct-data';
import { SorgentiListPage } from '../sorgentiList/sorgentiList';

@Component({
  selector: 'page-sorgenti',
  templateUrl: 'sorgenti.html'
})
export class SorgentiPage implements OnInit {
  title: string = 'Sorgenti';
  modeList: string = 'lista';

  sourceType: occurenciesType[] = [];

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

  getSources(): void {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('lbl_wait') + '...'
    });
    loading.present();
    this.eventService.getSourcesList()
      .then(sourceType => {
        loading.dismiss();
        this.sourceType = this.sourceType.concat(sourceType);
        this.storage.get('sorFavs').then(sorFavs => {
          if (sorFavs == null) {
            sorFavs = [];
            this.storage.set('sorFavs', sorFavs);
          } else {
            sorFavs.forEach(source => {
              let a = this.checkIndex(sorFavs, source);
              if (a >= 0) {
                let b = this.checkIndex(this.sourceType, source);
                this.sourceType[b].fav = true;
              }
            })
          }
        })
      })
  }

  doRefresh(refresher) {
    console.log('source list refresh', refresher);
    this.sourceType = [];
    setTimeout(() => {
      this.getSources();
      refresher.complete();
    });

  }

  ngOnInit(): void {
    this.getSources();
  }

  onSelect(source: occurenciesType): void {
    this.navCtrl.push(SorgentiListPage, { name: source.name, sor: source })
  }
}
