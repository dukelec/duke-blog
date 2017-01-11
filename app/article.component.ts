import { Title } from '@angular/platform-browser';

import { OnInit, OnDestroy, AfterViewInit, Compiler, Component, NgModule, ViewChild, ViewContainerRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { attributes2Array, escapeHtml, Codeblock } from './helper';
//import { Article, Reply, Account } from './blog';
import { BlogService } from './blog.service';
import { AppModule } from './app.module';


@Component({
  templateUrl: 'app/article.component.html',
  styleUrls: ['app/article.component.css']
})
export class ArticleComponent implements OnInit, OnDestroy {
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  article: any = {
    permissions: [],
    languages: [],
    categories: [],
    tags: []
  };
  replys: any = [];
  new_reply: any = {};
  
  private url: string;
  private componentRef: any;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private compiler: Compiler,
    private title: Title ) {
  }

  ngOnInit() {
  
    this.route.params
      .subscribe((params: Params) => this.readArticle(params['url']));
    
  }
  
  public ngOnDestroy(){
    //if (this.componentRef) {
    //    this.componentRef.destroy();
    //    this.componentRef = null;
    //}
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

        let template = this.article.body;
        if (this.article.format !== "html")
          template = '<pre>' + escapeHtml(template) + '<pre>';

        template = template.replace(/{{/g, "<span>&#123;</span>&#123;");
        template = template.replace(/{/g, "&#123;");
        
        @Component({template: template})
        class TemplateComponent {};
        
        @NgModule({imports: [ AppModule ], declarations: [TemplateComponent]})
        class TemplateModule {};

        const mod = this.compiler.compileModuleAndAllComponentsSync(TemplateModule);
        const factory = mod.componentFactories.find((comp) =>
          comp.componentType === TemplateComponent
        );
        const component = this.container.createComponent(factory);
        this.componentRef = component;
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

