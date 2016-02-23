export interface Hero {
  id: number;
  name: string;
}

export interface Article {
  date: string;
  url: string;
  title: string;
  lang: string;
  summary: string;
  categories: string;
  tags: string;
  purview: string;
  counter: number;
  body: string; // empty in list mode
}

export interface Reply {
  date: string;
  author_type: string;
  author: string;
  body: string;
}

export interface Account {
  email: string;
  name: string;
  purviews: string;
  site: string;
  message: string;
  note: string;
  //bad_guy: string;
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
