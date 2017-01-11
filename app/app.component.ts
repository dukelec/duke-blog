import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1 routerLink="/" routerLinkActive="active">Duke's Blog</h1>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  //title = 'Duke Blog;
}
