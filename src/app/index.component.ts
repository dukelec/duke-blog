import { Title } from '@angular/platform-browser';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { attributes2Array } from './helper';
import { BlogService } from './blog.service';

@Component({
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  articles: any = [];

  constructor(
    private router: Router,
    private blogService: BlogService,
    title: Title ) {
      title.setTitle("Duke's Blog");
  }

  ngOnInit() {
    this.blogService.getArticles().subscribe(
      data => {
        this.articles = data.articles;
        for (let a in this.articles) {
          let article = this.articles[a];
          let attrs = attributes2Array(article.attributes);
          article.permissions = (attrs as any).permissions;
          article.languages = (attrs as any).languages;
          article.categories = (attrs as any).categories;
          article.tags = (attrs as any).tags;
        }
      },
      err => console.error(err)
    );
  }

  gotoArticle(article: any) {
    this.router.navigate(['/', article.url]);
  }

}

