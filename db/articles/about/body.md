In the past two days, the blog system has been rewritten, the overall architecture has not changed, and it is still RESTful, supplemented by /archive snapshots to improve compatibility.

Major changes:
 - The structure of the file data directory is adjusted to facilitate local static browsing, and can be browsed on Github platforms (in case what happens unexpectedly, no one pays for the server, at least the contents of the article can still exist);
 - Metadata and other data file formats changed from ini to json, editing, parsing is more convenient, support for complex string is better;
 - Due to being published on platforms such as Github, sensitive information such as email addresses submitted by user reviews is encrypted and stored;
 - The bash script is no longer used in the backend. Instead, it is implemented using Python CGI;
 - The frontend no longer uses frameworks such as Angular2, barely writes Javascript code is simple and easy to maintain, and the page loading is much faster.

Features such as verification codes have not been added for the time being, as the discovery of RESTful blogs has a big advantage: no ad messages have ever been encountered.

The code for this blog in the Git repo is separate from the contents of this blog. If you want to try, clone the master branch:
Https://github.com/dukelec/duke-blog.git

<hr>
Backup:

<small>
I have writen a blog software based on GAE(Google App Engine) three years ago(Jan 2013),
after that, GAE update frequently, and cannot be accessed from mainland China,
so, I decided to write this new one. the old one's backup link: http://duke-blog.appspot.com

Features of this new one:
 - RESTful: backend and frontend are separated, exchange data through API interface;
 - Server side application writen by bash script, all data are stored by structed folders and files(not the traditional databases);
 - Browser side application build on Angular2, it's a SPA(Single Page Applacation);
 - Articles are supported in different formats, support markdown, html and plain text currently;
 - Article list can be procedured by any filter, no amount and type limit;
 - Sub-comment are supported;
 - Comment policy have multiple types: anonymous without verification, captcha verification or email verification.

Features remained from old one:
 - Permission management for articles.

Known disadvantages:
 - Most search engine not support pages which rendered by javascript (except Google Search); (take snapshot to static pages on /archive to solve this problem)
</small>
