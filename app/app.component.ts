import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';

import { BlogService } from './blog.service';
import { IndexComponent } from './index.component';
import { ArticleComponent } from './article.component';

@Component({
  selector: 'my-app',
  template: `
    <h1>Duke's Blog</h1>
    <!--nav>
      <a [routerLink]="['Index']">Index</a>
      <a [routerLink]="['Heroes']">Heroes</a>
    </nav-->
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    BlogService
  ]
})
@RouteConfig([
  {
    path: '/',
    name: 'Index',
    component: IndexComponent,
    useAsDefault: true
  },
  {
    path: '/:url',
    name: 'Article',
    component: ArticleComponent
  }
])
export class AppComponent {
  //title = 'Duke Blog;
}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
