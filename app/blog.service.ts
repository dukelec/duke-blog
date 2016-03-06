import { Article, Reply, Account } from './blog';
import { Injectable } from 'angular2/core';

@Injectable()
export class BlogService {
  getArticles() {
    return Promise.resolve([]);
    //return Promise.resolve(HEROES);
  }

  // See the "Take it slow" appendix
  /*
  getHeroesSlowly() {
    return new Promise<Hero[]>(resolve =>
      setTimeout(()=>resolve(HEROES), 2000) // 2 seconds
    );
  }
  */

  /*
	getHero(id: number) {
    return Promise.resolve(HEROES).then(
      heroes => heroes.filter(hero => hero.id === id)[0]
    );
  }
  */
}

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
