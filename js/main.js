"use strict";
/*
window.onbeforeunload = function () {
    return "Do you really want to close?";
};
*/

let index_template = (article) => `
<div class="blog-post" >
	<h2 class="blog-post-title" onclick="click_link('${article.url}')" >${article.title}</h2>
	<p class="blog-post-meta">Languages: ${article.languages.join(', ')} |
	        Categories: ${article.categories.join(', ')} | Tags: ${article.tags.join(', ')} |
	        ${format_date(article.date)} | Count: ${article.count}</p>
	<p>${article.summary}</p>
</div>`;

let article_template = (article) => `
<div class="blog-post">

  <h2 class="blog-post-title">${article.title}</h2>
  <p class="blog-post-meta">Languages: ${article.languages.join(', ')} |
	        Categories: ${article.categories.join(', ')} | Tags: ${article.tags.join(', ')} |
	        ${format_date(article.date)} | Count: ${article.count}</p>
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

function format_date(str)
{
    // https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today  = new Date(str);
    return today.toLocaleDateString("en-US", options);
}

function escape_html(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

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

function http_request(url, data=null)
{
    return new Promise(
        function (resolve, reject) {
            const request = new XMLHttpRequest();
            request.onload = function () {
                if (this.status === 200) {
                    resolve(this.response);
                } else {
                    reject(new Error(this.statusText)); // 404 etc.
                }
            };
            request.onerror = function () {
                reject(new Error(
                    'XMLHttpRequest Error: '+this.statusText));
            };
            if (data === null) {
                request.open("GET", url);
                request.send();
            } else {
                request.open("POST", url);
                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                request.send(JSON.stringify(data));
            }
        });
}

async function write_comment()
{
    console.log('write comment');
    let comment = {}
    comment.url = window.location.pathname.slice(1)
    comment.name = document.getElementById('comment.name').value
    comment.email = document.getElementById('comment.email').value
    comment.body = document.getElementById('comment.body').value
    if (!comment.name || !comment.email || !comment.body)
        alert('Please input your name, email and comment body!');
    console.log(comment)
    try {
        let ret = JSON.parse(await http_request('/api/write-comment', comment));
        if (ret.success)
            alert(ret.success);
        else if (ret.error)
            alert(ret.error);
        else
            alert('Unknown error!');
    } catch (err) {
        alert(err);
    }
}

async function load_index()
{
    console.log('load index');
    try {
        let index = JSON.parse(await http_request('/api/read-index'));
        //console.log(index);
        let app_body = document.querySelector('app-body');
        app_body.innerHTML = '';
        for (let article of index) {
            //console.log(article);
            app_body.innerHTML += index_template(article);
        }
    } catch (err) {
        alert(err);
    }
}

async function load_article(url)
{
    console.log('load article: ' + url);
    try {
        let article = JSON.parse(await http_request('/api/read-article?url=' + url.slice(1)));
        //console.log(article);
        
        if (article.formats.body == "html") {
            update_link(article, url);
        } else if (article.formats.body == "md") {
            var converter = new showdown.Converter({extensions: ['codehighlight', 'bootstrap-tables']});
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
                comment.body = escape_html(comment.body);
                comments_body.innerHTML += comment_template(comment);
            }
        }
    } catch (err) {
        alert(err);
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

window.onload = function() {
    load_app_body("window onload");
};

window.addEventListener('popstate', function(e) {
    load_app_body("refresh");
});


