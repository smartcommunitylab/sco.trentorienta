import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const mainEvents = [
      { id: 1,  title: 'Evento 1', description: 'Descrizione 1', image:'test1.jpg', tags:['party'], source:'comunetn', themes: ['cultura'], created: '20170705110001' },
      { id: 2,  title: 'Evento 2', description: 'Descrizione 2', image:'test2.jpg', tags:['exhibition','party'], source:'comunetn', themes: ['cultura'], created: '20170705110002' },
      { id: 3,  title: 'Evento 3c', description: 'Descrizione 3', image:'test3.jpg', tags:['match'], source:'asis', themes: ['sport'], created: '20170705110003' },
      { id: 4,  title: 'Evento 4', description: 'Descrizione 4', image:'test4.jpg', tags:['music'], source:'socialstone', themes: ['cultura'], created: '20170705110004' },
      { id: 5,  title: 'Evento 5', description: 'Descrizione 5', image:'test5.jpg', tags:['party'], source:'socialstone', themes: ['cultura'], created: '20170705110005' },
      { id: 6,  title: 'Evento 6', description: 'Descrizione 6', image:'test6.jpg', tags:['race'], source:'comunetn', themes: ['sport'], created: '20170705110006' },
      { id: 7,  title: 'Evento 7', description: 'Descrizione 7', image:'test7.jpg', tags:['exhibition'], source:'comunetn', themes: ['cultura'], created: '20170705110007' },
      { id: 8,  title: 'Evento 8', description: 'Descrizione 8', image:'test8.jpg', tags:['music'], source:'donquijote', themes: ['cultura'], created: '20170705110008' },
      { id: 9,  title: 'Evento 9', description: 'Descrizione 9', image:'test9.jpg', tags:['party'], source:'donquijote', themes: ['cultura'], created: '20170705110009' },
      { id: 10,  title: 'Evento 10', description: 'Descrizione 10', image:'test10.jpg', tags:['match'], source:'comunetn', themes: ['sport'], created: '20170705110010' },
    ];
    return {mainEvents};
  }
}