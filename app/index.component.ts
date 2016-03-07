import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { Article, Reply, Account } from './blog';
import { BlogService } from './blog.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/index.component.html',
  styleUrls: ['app/index.component.css']
})
export class IndexComponent implements OnInit {

  articles: Article[] = [];

  constructor(
    private _router: Router,
    private _blogService: BlogService) {
  }

  ngOnInit() {
    this._blogService.getArticles().subscribe(
      data => { this.articles = data.articles},
      err => console.error(err),
      () => console.log('done loading articles')
    );
    //this._blogService.getArticles()
    //  .then(articles => this.articles = articles.slice(1,5));
  }

  gotoArticle(article: Article) {
    let link = ['Article', { url: article.url }];
    this._router.navigate(link);
  }
}

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
