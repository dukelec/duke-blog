import { Title } from '@angular/platform-browser';

import { OnInit, Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { attributes2Array, escapeHtml } from './helper';
import { BlogService } from './blog.service';

declare var hljs: any;
declare var showdown: any;

@Component({
  templateUrl: './article.component.html'//,
  //styleUrls: ['./article.component.css']
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
        
        function update_link(self, body) {
            // html:
            let parser = new DOMParser()
            let doc = parser.parseFromString(body, "text/html");
            //let doc = parser.parseFromString(self.article.body, "text/html");
            
            let y = doc.querySelectorAll('[href]');
            for (var i = 0; i < y.length; i++) {
              let href = y[i].getAttribute('href');
              if (href.search("//") == -1 && href.search("#") != 0)
                y[i].setAttribute('href', '/' + self.url + '/' + href);
            }
            y = doc.querySelectorAll('[src]');
            for (var i = 0; i < y.length; i++) {
              let href = y[i].getAttribute('src');
              if (href.search("//") == -1)
                y[i].setAttribute('src', '/' + self.url + '/' + href);
            }
            y = doc.querySelectorAll('[poster]');
            for (var i = 0; i < y.length; i++) {
              let href = y[i].getAttribute('poster');
              if (href.search("//") == -1)
                y[i].setAttribute('poster', '/' + self.url + '/' + href);
            }
            
            if (self.article.format != "markdown") {
                y = doc.querySelectorAll("pre code");
                if (y.length > 0) {
                    for (var i = 0; i < y.length; i++) {
                        y[i].innerHTML = y[i].innerHTML.replace("\n", "");
                        for (var i = 0; i < y.length; i++)
                            hljs.highlightBlock(y[0]);
                    }
                }
            }
            self.body = doc.body.innerHTML;
        }
        
        if (this.article.format == "markdown") {
            var converter = new showdown.Converter({extensions: ['codehighlight', 'bootstrap-tables']});
            update_link(this, converter.makeHtml(this.article.body));
        } else { // raw html
            update_link(this, this.article.body);
        }
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

