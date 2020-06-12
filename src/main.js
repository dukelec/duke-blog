/*
 * Software License Agreement (MIT License)
 *
 * Author: Duke Fong <d@d-l.io>
 */

import { fetch_timo, escape_html, format_date } from './utils/helper.js'
import { Idb } from './utils/idb.js';

let db = null;

let index_template = (article) => `
<div class="blog-post" >
	<h2 class="blog-post-title" onclick="click_link('${article.url}')" >${article.title}</h2>
	<p class="blog-post-meta">Languages: ${article.languages.join(', ')} |
	        Categories: ${article.categories.join(', ')} | Tags: ${article.tags.join(', ')} |
	        ${format_date(article.date)} | Count: ${article.count}
	        ${article.last ? '<br>Last modified: ' + format_date(article.last) : ''}</p>
	<p>${article.summary}</p>
</div>`;

let article_template = (article) => `
<div class="blog-post">

  <h2 class="blog-post-title">${article.title}</h2>
  <p class="blog-post-meta">Languages: ${article.languages.join(', ')} |
	        Categories: ${article.categories.join(', ')} | Tags: ${article.tags.join(', ')} |
	        ${format_date(article.date)} | Count: ${article.count}
	        ${article.last ? '<br>Last modified: ' + format_date(article.last) : ''}</p>
  <div>${article.body}</div>

</div><!-- /.blog-post -->

<h3>Comments:</h3>
<comments></comments>

<br/>

<div class="form-horizontal">
  <div class="form-group">
    <label class="col-sm-1 control-label">Name</label>
    <div class="col-sm-4">
      <input id="comment.name" type="text" class="form-control" placeholder="Name" required>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-1 control-label">Email</label>
    <div class="col-sm-4">
      <input id="comment.email" type="email" class="form-control" placeholder="Email" required>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-1 control-label">Body</label>
    <div class="col-sm-8">
      <textarea id="comment.body" class="form-control" rows="4"></textarea>
    </div>
  </div>
  <!--label>captcha: </label><input placeholder="captcha" /><br/-->
  <div class="form-group">
    <div class="col-sm-offset-1 col-sm-8">
      <button type="submit" class="btn btn-default" onclick="write_comment()" >Submit</button>
    </div>
  </div>
</div>`;

let comment_template = (comment) => `
  <div>
	  <p><small>#${comment.id}, ${format_date(comment.date)}, ${comment.name} &lt;${comment.masked}&gt; wrote:</small></p>
	  <p>${comment.body}</p>
  </div>`;


function update_link(article, url)
{
    // html:
    let parser = new DOMParser()
    let doc = parser.parseFromString(article.body, "text/html");
    
    let y = doc.querySelectorAll('[href]');
    for (var i = 0; i < y.length; i++) {
      let href = y[i].getAttribute('href');
      if (href.search("//") == -1 && href.search("#") != 0)
        y[i].setAttribute('href', url + '/' + href);
    }
    y = doc.querySelectorAll('[src]');
    for (var i = 0; i < y.length; i++) {
      let href = y[i].getAttribute('src');
      if (href.search("//") == -1)
        y[i].setAttribute('src', url + '/' + href);
    }
    y = doc.querySelectorAll('[poster]');
    for (var i = 0; i < y.length; i++) {
      let href = y[i].getAttribute('poster');
      if (href.search("//") == -1)
        y[i].setAttribute('poster', url + '/' + href);
    }
    
    if (article.formats.body != "markdown") {
        y = doc.querySelectorAll("pre code");
        if (y.length > 0) {
            for (var i = 0; i < y.length; i++) {
                y[i].innerHTML = y[i].innerHTML.replace("\n", "");
                for (var i = 0; i < y.length; i++)
                    hljs.highlightBlock(y[0]);
            }
        }
    }
    article.body = doc.body.innerHTML;
}


async function write_comment()
{
    console.log('write comment');
    let comment = {};
    comment.url = window.location.pathname.slice(1);
    comment.name = document.getElementById('comment.name').value;
    comment.email = document.getElementById('comment.email').value;
    comment.body = document.getElementById('comment.body').value;
    if (!comment.name || !comment.email || !comment.body) {
        alert('Please input your name, email and comment body!');
        return;
    }
    console.log(comment);
    await db.set('var', 'bkup', comment);

    let ret = await fetch_timo('/api/write-comment', {method: 'POST', body: JSON.stringify(comment)});
    if (ret == null) {
        alert('write-comment: error');
        return;
    }
    if (ret.success)
        alert(ret.success);
    else if (ret.error)
        alert(ret.error);
    else
        alert('Unknown error!');
    if (ret.refresh)
        location.reload();
}

async function load_index()
{
    console.log('load index');
    document.title = "Duke's Blog";

    let index = await fetch_timo('/api/read-index');
    if (index == null) {
        alert('read-index: error');
        return;
    }
    //console.log(index);
    let app_body = document.querySelector('app-body');
    app_body.innerHTML = '';
    for (let article of index) {
        //console.log(article);
        app_body.innerHTML += index_template(article);
    }
}

async function load_article(url)
{
    console.log('load article: ' + url);

    let article = await fetch_timo('/api/read-article?url=' + url.slice(1));
    if (article == null) {
        alert('read-article: error');
        return;
    }
    
    //console.log(article);
    document.title = article.title + " | Duke's Blog";
    
    if (article.formats.body == "html") {
        update_link(article, url);
    } else if (article.formats.body == "md") {
        let converter = new showdown.Converter({extensions: ['codehighlight', 'bootstrap-tables']});
        article.body = converter.makeHtml(article.body);
        update_link(article, url);
    } else {
        article.body = '<pre>' + escape_html(article.body) + '<pre>';
    }
    
    let app_body = document.querySelector('app-body');
    app_body.innerHTML = article_template(article);
    
    if (article.comments) {
        let comments_body = document.querySelector('comments');
        for (let comment of article.comments) {
            let converter = new showdown.Converter({extensions: ['codehighlight', 'bootstrap-tables']});
            comment.body = converter.makeHtml(comment.body);
            comments_body.innerHTML += comment_template(comment);
        }
    }
    
    let bkup = await db.get('var', 'bkup');
    if (bkup) {
        document.getElementById('comment.name').value = bkup.name;
        document.getElementById('comment.email').value = bkup.email;
        document.getElementById('comment.body').value = bkup.body;
    }
}

function click_link(url)
{
    if (!url.startsWith('/'))
        url = '/' + url;
    if (window.location.pathname == url)
        return;
    history.pushState(null, null, url);
    if (url != '/')
        load_article(url);
    else
        load_index();
    window.scrollTo(0, 0);
}

function load_app_body(msg)
{
    console.log(msg);
  
    if (window.location.pathname == '/') {
        load_index();
    } else {
        load_article(window.location.pathname);
    }
}

window.onload = async function() {
    db = await new Idb('blog', ['var']);
    
    load_app_body("window onload");
    window.click_link = click_link;
    window.write_comment = write_comment;
};

window.addEventListener('popstate', function(e) {
    load_app_body("refresh");
});

