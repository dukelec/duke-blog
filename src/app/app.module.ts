import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';


import { APP_BASE_HREF } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';

import { BlogService } from './blog.service';
import { IndexComponent } from './index.component';
import { ArticleComponent } from './article.component';

import { JoinPipe, JoinStr2Date, SafeHtmlPipe } from './helper';

const appRoutes: Routes = [
  { path: '',     component: IndexComponent },
  { path: ':url', component: ArticleComponent }
];


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    IndexComponent,
    ArticleComponent,
    JoinPipe,
    JoinStr2Date,
    SafeHtmlPipe
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    BlogService
  ]
})
export class AppModule { }
