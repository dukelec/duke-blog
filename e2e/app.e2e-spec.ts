import { NgBlogPage } from './app.po';

describe('ng-blog App', function() {
  let page: NgBlogPage;

  beforeEach(() => {
    page = new NgBlogPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
