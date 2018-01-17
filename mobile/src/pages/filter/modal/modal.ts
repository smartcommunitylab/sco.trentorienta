import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';

import { eventType,occurenciesType } from '../../../app/struct-data';

/**
 * Generated class for the ModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {

  title: string;

  theOrSor: boolean;
  s: string[] = [];

  List: occurenciesType[] = null;

  checked: number;

  copy: string[];

  constructor(public viewCtrl: ViewController, params: NavParams, public navParams: NavParams, public translate: TranslateService, public loadingCtrl: LoadingController) {
    this.theOrSor = params.get('theOrSor');
    this.List = params.get('List');
    this.s = params.get('Chose');
    
    if(this.theOrSor) {
      this.title = this.translate.instant('Themes');
    }
    else {
      this.title = this.translate.instant('Sources');
    }
    this.checked = 2;
  }

  all() {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('lbl_wait') + '...'
    });
    loading.present();
    this.s = [];
    this.List.forEach( element => { this.s.push(element.name); } );
    this.checked = 1;
    loading.dismiss();
  }

  none() {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('lbl_wait') + '...'
    });
    loading.present();
    this.s = [];
    this.checked = 0;
    loading.dismiss();
  }

  invert() {
    let loading = this.loadingCtrl.create({
      content: this.translate.instant('lbl_wait') + '...'
    });
    loading.present();
    this.List.forEach(element => {
      this.change(element.name);
    });
    this.checked = 2;
    loading.dismiss();
  }

  change(element: string) {
    if(this.contains(element)) {
      delete this.s[this.s.indexOf(element)];
    }
    else {
      this.s.push(element);
    }
  }

  contains(obj) {
    if(this.s == undefined || this.s == null) {
      this.s = [];
      return false;
    }
    for (var i = 0; i < this.s.length; i++) {
      if (this.s[i] === obj) {
          return true;
      }
    }
    return false;
  }

  ok() {
    var copy = [];
    for (var i = 0; i < this.s.length; i++) {
      if (this.s[i] != undefined) copy.push(this.s[i]);
    } 
    this.viewCtrl.dismiss(copy);
  }

  back() {
    this.viewCtrl.dismiss();
  }

}
