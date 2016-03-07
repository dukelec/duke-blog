import { Component, OnInit } from 'angular2/core';
import { RouteParams } from 'angular2/router';

import { Article, Reply, Account } from './blog';
import { BlogService } from './blog.service';

@Component({
  selector: 'my-hero-detail',
  templateUrl: 'app/article.component.html',
  styleUrls: ['app/article.component.css'],
  inputs: ['article']
})
export class ArticleComponent implements OnInit {
  article: Article;
  replys: Reply[] = [];
  new_reply: Reply = {};

  constructor(
    private _blogService: BlogService,
    private _routeParams: RouteParams) {
  }

  ngOnInit() {
    let url = this._routeParams.get('url');
    this._blogService.getArticle(url).subscribe(
      data => { this.article = data.article},
      err => console.error(err),
      () => console.log('done loading article')
    );
    this._blogService.getReplys(url).subscribe(
      data => { this.replys = data.replys},
      err => console.error(err),
      () => console.log('done loading replys')
    );
  }

  writeReply() {
    let url = this._routeParams.get('url');
    this.new_reply.url = url;
    this.new_reply.format = 'plain';
    this.new_reply.action = 'new';
    this._blogService.writeReply(this.new_reply).subscribe(
      data => alert('done write reply: ' + data),
      err => console.error(err),
      () => console.log('done write reply')
    );
  }

  goBack() {
    window.history.back();
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
