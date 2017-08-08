import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version';

@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})

export class CreditsPage {
  title: string = 'Credits';
  info: string = null;
  version: string = null;

  constructor(private appVersion: AppVersion, private translate: TranslateService){
    translate.addLangs(["it", "en"]);
    // translate.setDefaultLang('it');

    // debugger;
    appVersion.getVersionNumber().then((version) => {
      this.version = "v " + version;
    }).catch(function (error) {
      this.version = "v " + '1.0';
    });
    
    
    translate.setTranslation('it',{
      Home: 'Home (it)',
      Credits: 'Referenze',
      Favorites: 'Preferiti',
      Themes: 'Temi',
      Sources: "Sorgenti",
      Tag: 'Etichette',
      menu_about: 'Informazioni',
      lbl_credit_p2: "Che cosa è?",
      app_name: 'TrentOrienta',
      information: "WeLive Player permette di scoprire e lanciare le applicazioni mobile sviluppate dagli utenti WeLive attraverso l'utilizzo della piattaforma WeLive. <br /> <br /> Tale piattaforma è uno dei risultati del progetto WeLive, un progetto H2020 finanziato dall'UE, il cui obiettivo è quello di promuovere un nuovo concetto di pubblica amministrazione, basato sulla co-creazione di servizi urbani mobili, insieme ai cittadini.<br /><br />WeLive Player è un contenitore in cui tutti i servizi creati dagli utenti WeLive, utilizzando la piattaforma WeLive, ed esposti sul Marketplace di WeLive, vengono mostrati e suggeriti agli utenti Android in base alle loro preferenze.<br /><br />I servizi disponibili sono raggruppati secondo le quattro città/regioni pilota coinvolte nella sperimentazione all'interno del progetto: Bilbao, Helsinki-Uusimaa, Novi Sad, Trento.<br /><br />L'applicazione permette di filtrare, cercare e ordinare le applicazioni in base a diversi criteri. All'utente viene chiesto di autenticarsi utilizzando un account social (Google/Facebook) o il proprio account WeLive. Durante il processo di autenticazione l'utente è invitato a fornire in modo facoltativo alcuni dati personali che verranno poi utilizzati dalla piattaforma WeLive per suggerire applicazioni potenzialmente interessanti per l'utente.<br /><br />WeLive Player permette quindi all'utente di scaricare e lanciare sul proprio smartphone le applicazioni scelte. Infine, esso mostra i commenti e le valutazioni espresse dagli utenti sul Marketplace di WeLive relativamente di tutte le applicazioni mostrate.",
      credit_info: "Il progetto WeLive è stato finanziato dal programma H2020 della Commissione Europea per la ricerca, lo sviluppo tecnologico e l’ innovazione secondo l’accordo N° 645845",
    });

    translate.setTranslation('en',{
      Home: 'Home',
      Credits: "Credits",
      Favorites: 'Favorites',
      Themes: 'Themes',
      Sources: "Sources",
      Tag: 'Tag', 
      menu_about: 'Informations',
      lbl_credit_p2: "What is it?",
      app_name: 'TrentoInforma',
      information: "The WeLive Player gives the possibility to discover and launch the mobile apps developed by WeLive users using the WeLive framework.<br /><br />The WeLive framework is one of the results of the WeLive project, a H2020 project funded by the EU, whose goal is to foster a new concept of public administration, based on citizen co-created mobile urban services.<br /><br />The WeLive Player is a container in which all the services created by WeLive users using the WeLive framework, and exposed onto the WeLive Marketplace, are shown and suggested to Android users basing on their preferences.<br /><br />The available services are grouped by the four pilot cities/regions involved in the project: Bilbao, Helsinki-Usimaa, Novi Sad, Trento.<br /><br />The app allows to filter, search and order the apps using different criteria. It requires to authenticate using wither a social (Google/Facebook) or a WeLive account. During the authentication process the user is asked to optionally provide some personal details that are used by the WeLive framework to suggest apps that are more likely to be of interest.<br /><br />The WeLive Player allows to download and launch the apps chosen by the user. Finally, it shows the comments and ratings expressed by the users on the WeLive Marketplace about the apps.",
      credit_info: "The WeLive project has been financed under European Commission's H2020 programme for research, development and innovation under agreement #64584",
    });

    this.info = translate.instant('information');
    
  }

}
