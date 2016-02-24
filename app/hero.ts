export interface Hero {
  id: number;
  name: string;
}

export interface Article {
  url: string;
  title: string;
  date: string; // date object?
  attributes: string; // languages + categories + tags + permissions...
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


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
