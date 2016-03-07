import { Article, Reply, Account } from './blog';
import { Injectable } from 'angular2/core';
import { Http, Response } from 'angular2/http';
import 'rxjs/Rx';


@Injectable()
export class BlogService {

  constructor(private http:Http) { }

  getArticles() {
    return this.http.get('/api/read-articles').map((res:Response) => res.json());
  }

  // See the "Take it slow" appendix
  /*
  getHeroesSlowly() {
    return new Promise<Hero[]>(resolve =>
      setTimeout(()=>resolve(HEROES), 2000) // 2 seconds
    );
  }
  */

	getArticle(url: string) {
    return this.http.get('/api/read-article?url=' + url).map((res:Response) => res.json());
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
