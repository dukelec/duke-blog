import { Component, OnInit, DynamicComponentLoader, ElementRef } from 'angular2/core';
import { RouteParams } from 'angular2/router';

import { Article, Reply, Account } from './blog';
import { BlogService } from './blog.service';

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;")
         .replace(/{{/g, "<span>{</span>{");
 }

//simple codeblock
@Component({
  selector: 'codeblock',
  template: '<ng-content></ng-content>'
})
class Codeblock  {
  constructor(elementRef: ElementRef) {
      this.elementRef = elementRef;
  }
  ngAfterContentInit() {
    s = this.elementRef.nativeElement.innerHTML;
    if (s.charAt(0) === '\n')
      s = s.substr(1);
    this.elementRef.nativeElement.innerHTML = '<pre>' + s + '</pre>';
  }
}


@Component({
  selector: 'my-hero-detail',
  templateUrl: 'app/article.component.html',
  styleUrls: ['app/article.component.css'],
  inputs: ['article']//,
  //directives: [Angular2Component]
})
export class ArticleComponent implements OnInit {
  article: Article = {};
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

        template = this.article.body;
        if (this.article.format !== "html")
          template = '<pre>' + escapeHtml(template) + '<pre>';
        @Component({
          selector: 'compiled-component',
          template: template;
          directives: [Codeblock]
        })
        class CompiledComponent {
        };
        this.dcl.loadIntoLocation(CompiledComponent, this.elementRef, 'container');
      },
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
