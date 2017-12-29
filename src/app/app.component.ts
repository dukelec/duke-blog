import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <div class="blog-header">
        <h1 routerLink="/" routerLinkActive="active" class="blog-title">Duke's Blog</h1>
        <p class="lead blog-description">Learning is a life long journey.</p>
      </div>
      <div class="row">
        <div class="col-sm-12 blog-main">
          <router-outlet></router-outlet>
        </div><!-- /.blog-main -->
      </div><!-- /.row -->
    </div><!-- /.container -->
  `//,
  //styleUrls: ['./app.component.css'],
})
export class AppComponent {
  //title = 'Duke Blog;
}
