import { Component, OnInit, DynamicComponentLoader, ElementRef } from 'angular2/core';
import { RouteParams } from 'angular2/router';

import { JoinPipe, JoinStr2Date, Codeblock, escapeHtml, attributes2Array } from './helper';
import { Article, Reply, Account } from './blog';
import { BlogService } from './blog.service';


@Component({
  selector: 'my-hero-detail',
  templateUrl: 'app/article.component.html',
  styleUrls: ['app/article.component.css'],
  pipes: [JoinPipe, JoinStr2Date],
  inputs: ['article']//,
  //directives: [Angular2Component]
})
export class ArticleComponent implements OnInit {
  article: Article = {
    permissions: [],
    languages: [],
    categories: [],
    tags: []
  };
  replys: Reply[] = [];
  new_reply: Reply = {};

  constructor(
    private _blogService: BlogService,
    private _routeParams: RouteParams,
    dcl: DynamicComponentLoader,
    elementRef: ElementRef) {
      this.dcl = dcl;
      this.elementRef = elementRef;
  }

  ngOnInit() {
    let url = this._routeParams.get('url');
    this._blogService.getArticle(url).subscribe(
      data => {
        this.article = data.article;

        let attrs = attributes2Array(this.article.attributes);
        this.article.permissions = attrs.permissions;
        this.article.languages = attrs.languages;
        this.article.categories = attrs.categories;
        this.article.tags = attrs.tags;

        template = this.article.body;
        if (this.article.format !== "html")
          template = '<pre>' + escapeHtml(template) + '<pre>';
        template = template.replace(/{{/g, "<span>{</span>{");
        @Component({
          selector: 'compiled-component',
          template: template;
          directives: [Codeblock]
        })
        class CompiledComponent {
        };
        this.dcl.loadIntoLocation(CompiledComponent, this.elementRef, 'container');
      },
      err => console.error(err)
    );
    this._blogService.getReplys(url).subscribe(
      data => { this.replys = data.replys},
      err => console.error(err)
    );
  }

  writeReply() {
    if (!this.new_reply.name || !this.new_reply.email || !this.new_reply.body) {
      alert("name, email and body are required!");
      return;
    }

    let url = this._routeParams.get('url');
    this.new_reply.url = url;
    this.new_reply.format = 'plain';
    this.new_reply.action = 'new';
    this._blogService.writeReply(this.new_reply).subscribe(
      data => {
        if (data.status === "success") {
          alert('Comment post successed, please wait for review.');
          this.new_reply = {}; //cleanup
        } else
          alert('Server return error: ' + data)
      },
      err => alert('Error: ' + err)
    );
  }
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
