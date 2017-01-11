export interface Hero {
  id: number;
  name: string;
}

export interface Article {
  url: string;
  title: string;
  date: string; // date object?
  attributes: string; // languages + categories + tags + permissions...
  //permissions: any; languages: any; categories: any; tags: any;
  count: number;
  format: string;
  summary: string;
  body: string; // empty in list mode
}

export interface Reply {
  date: string;
  registered: boolean;
  name: string;
  email: string;
  site: string;
  format: string;
  body: string;
}

export interface Account {
  name: string;
  email: string;
  permissions: string;
  site: string;
  message: string;
  note: string;
  //bad_guy: string; // use blacklist instead
}

