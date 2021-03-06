export class eventType {
  id: number;
  title: string;
  description: string;
  image: string;
  imageThumb?: string;
  tags: string [];
  source: string;
  themes: string [];
  address: string;
  coordX: number;
  coordY: number;
  created: string;
  eventDate: string;
  createdDate: any;
  eventoDate: any;
  eventStart: string;
}

// simple struct
export class occurenciesType {
  name: string;
  count: number;
  fav: boolean;
}

export class district {
  name: string;
  coordinates: number[];
}
