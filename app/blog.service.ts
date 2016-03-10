import { Article, Reply, Account } from './blog';
import { Injectable } from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import 'rxjs/Rx';

function transformRequest (obj) {
    var str = [];
    for(var p in obj) {
      if (obj[p] === undefined)
        obj[p] = "";
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return str.join("&");
}

@Injectable()
export class BlogService {

  constructor(private http:Http) { }

  getArticles() {
    return this.http.get('/api/read-articles').map((res:Response) => res.json());
  }

	getArticle(url: string) {
    return this.http.get('/api/read-article?url=' + url).map((res:Response) => res.json());
  }

	getReplys(url: string) {
    return this.http.get('/api/read-replys?url=' + url).map((res:Response) => res.json());
  }

	writeReply(reply: Reply) {
    var body = transformRequest(reply);
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post('/api/write-reply', body,
        {headers:headers}).map((res:Response) => res.json());
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
