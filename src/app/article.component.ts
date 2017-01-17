import { Title } from '@angular/platform-browser';

import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { attributes2Array, escapeHtml } from './helper';
import { BlogService } from './blog.service';

declare var hljs: any;

@Component({
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

  article: any = {
    permissions: [],
    languages: [],
    categories: [],
    tags: []
  };
  replys: any = [];
  new_reply: any = {};
  body: string;
  
  private url: string;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private title: Title ) {
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => this.readArticle(params['url']));
  }
  
  readArticle (url:string) {
    this.url = url;
  
    this.blogService.getArticle(url).subscribe(
      (data: any) => {
        this.article = data.article;

        this.title.setTitle(this.article.title + " - Duke's Blog");

        let attrs = attributes2Array(this.article.attributes);
        this.article.permissions = (attrs as any).permissions;
        this.article.languages = (attrs as any).languages;
        this.article.categories = (attrs as any).categories;
        this.article.tags = (attrs as any).tags;
        
        
        if (this.article.format == "plain") {
          this.body = '<pre>' + escapeHtml(this.article.body) + '<pre>';
          return;
        }
        
        // html:
        let parser = new DOMParser()
        let doc = parser.parseFromString(this.article.body, "text/html");
        
        let y = doc.querySelectorAll('[href]');
        for (var i = 0; i < y.length; i++) {
          var href = y[i].getAttribute('href');
          if (href.search("//") == -1 && href.search("#") != 0)
            y[i].setAttribute('href', this.url + '/' + href);
        }
        
        y = doc.querySelectorAll("pre code");
        if (y.length > 0) {
            for (var i = 0; i < y.length; i++)
                y[i].innerHTML = y[i].innerHTML.replace("\n", "");
            if (typeof hljs === 'undefined') {
                let p = this;
                
                let script = document.createElement('script');
                script.type = "text/javascript";
                script.src = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/highlight.min.js";
                script.onload = function () {
                    console.debug('highlight script loaded');
                    for (var i = 0; i < y.length; i++)
                        hljs.highlightBlock(y[0]);
                    p.body = doc.body.innerHTML;
                };
                document.getElementsByTagName("head")[0].appendChild(script);
                
                let fileref = document.createElement('link');
                fileref.rel = "stylesheet";
                fileref.type = "text/css";
                fileref.href = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.9.0/styles/default.min.css";
                fileref.onload = function () {
                    console.debug('highlight css loaded');
                }
                document.getElementsByTagName("head")[0].appendChild(fileref);
            } else {
                for (var i = 0; i < y.length; i++)
                    hljs.highlightBlock(y[0]);
            }
        }
        this.body = doc.body.innerHTML;
      },
      (err: any) => console.error(err)
    );
    this.blogService.getReplys(url).subscribe(
      (data: any) => { this.replys = data.replys},
      (err: any) => console.error(err)
    );
  }


  writeReply () {
    if (!this.new_reply.name || !this.new_reply.email || !this.new_reply.body) {
      alert("name, email and body are required!");
      return;
    }

    this.new_reply.url = this.url;
    this.new_reply.format = 'plain';
    this.new_reply.action = 'new';
    this.blogService.writeReply(this.new_reply).subscribe(
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

