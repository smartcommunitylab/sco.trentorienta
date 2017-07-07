import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

export class News{
    notiziaNome: string;
    commento: string;
}

@Component({
  selector: 'page-elementList',
  templateUrl: 'elementList.html'
})

export class ElementListPage {
    elementList: string = "lista";
    notizia : News = {
        notiziaNome: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/200px-HTML5_logo_and_wordmark.svg.png",
        commento: "KYA AMYK",
    };
    constructor(public navCtrl: NavController) {

    }

}