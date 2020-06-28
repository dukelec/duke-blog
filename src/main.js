/*
 * Software License Agreement (MIT License)
 *
 * Author: Duke Fong <d@d-l.io>
 */

import { fetch_timo, format_date, sha1 } from './utils/helper.js'
import { Idb } from './utils/idb.js';

let db = null;
let captcha_id = null;
let captcha_en = true;
let md_conv = new showdown.Converter({extensions: ['codehighlight', 'bootstrap-tables']});

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
    <label class="col-sm-2 control-label">Reply to</label>
    <div class="col-sm-4">
      <input id="comment.reply_to" type="text" class="form-control" placeholder="#n or #n.n or empty">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">Name *</label>
    <div class="col-sm-4">
      <input id="comment.name" type="text" class="form-control" placeholder="Name" required>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">Email *</label>
    <div class="col-sm-4">
      <input id="comment.email" type="email" class="form-control" placeholder="Email" required>
    </div>
    <div class="col-sm-2">
      <button type="submit" class="btn btn-default" id="login_btn" onclick="login()">${sid ? 'Re-login' : 'Login'} (Manage comments)</button>
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">Site</label>
    <div class="col-sm-4">
      <input id="comment.site" type="text" class="form-control" placeholder="https://">
    </div>
  </div>
  <div class="form-group">
    <label class="col-sm-2 control-label">Body *</label>
    <div class="col-sm-8">
      <textarea id="comment.body" class="form-control" rows="4" placeholder="Support Markdown"></textarea>
    </div>
    <div class="col-sm-2">
      <button type="submit" class="btn btn-default" onclick="restore_comment_body()">Restore</button>
    </div>
  </div>
  <div class="form-group" ${article.conf.captcha ? '' : 'style="display:none;"'}>
    <label class="col-sm-2 control-label">Captcha *</label>
    <div class="col-sm-2">
      <input id="comment.captcha" type="text" class="form-control" required>
    </div>
    <div class="col-sm-2" id="captcha_show" onclick="load_captcha()">
      <button type="submit" id="captcha_btn" class="btn btn-default">Load</button>
    </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-2 col-sm-8">
      <button type="submit" class="btn btn-default" id="new_comment_btn" onclick="write_comment()">Submit</button>
    </div>
  </div>
</div>`;

let comment_template = (comment) => `
  <div style="padding-left: ${comment.id.includes('.') ? '10' : '0'}px;">
	  <p><small>#${comment.id}, ${format_date(comment.date)},
	    ${comment.site ? '<a href="' + comment.site + '">' : ''}${comment.name}${comment.site ? '</a>' : ''}
	    ${comment.notify ? '' : '<del>'}&lt;${comment.m_show}&gt;${comment.notify ? '' : '</del>'} wrote:</small>
	    <button type="submit" class="btn btn-sm" id="set_notify_btn_${comment.id}" onclick="set_notify('${comment.id}', !${comment.notify})"
	     ${sid && bkup.m_hash == comment.m_hash ? '' : 'style="display:none;"'}>${comment.notify ? 'Unsubscribe' : 'Subscribe'}</button>
	    <button type="submit" class="btn btn-sm" id="delete_comment_btn_${comment.id}" onclick="delete_comment('${comment.id}')"
	     ${sid && bkup.m_hash == comment.m_hash ? '' : 'style="display:none;"'}>Delete</button>
	  </p>
	  <p>${comment.body}</p>
  </div>`;


function update_link(html, url)
{
    // html:
    let parser = new DOMParser()
    let doc = parser.parseFromString(html, "text/html");

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
    return doc.body.innerHTML;
}


window.write_comment = async function()
{
    console.log('write comment');
    let comment = {};
    comment.cmd = 'new';
    comment.url = window.location.pathname.slice(1);
    comment.name = document.getElementById('comment.name').value;
    comment.email = document.getElementById('comment.email').value.toLowerCase();
    comment.site = document.getElementById('comment.site').value;
    comment.body = document.getElementById('comment.body').value;
    if (!comment.name || !comment.email || !comment.body) {
        alert('Please input your name, email and comment body!');
        return;
    }
    await db.set('var', 'bkup', comment);

    comment.reply_to = document.getElementById('comment.reply_to').value;
    if (comment.reply_to.startsWith('#'))
        comment.reply_to = comment.reply_to.slice(1);
    comment.captcha_id = captcha_id;
    comment.captcha_code = document.getElementById('comment.captcha').value;
    comment.sid = await db.get('var', 'sid');
    if (captcha_en && (!comment.captcha_id || !comment.captcha_code)) {
        alert('This operation requires a captcha.');
        document.getElementById("comment.captcha").focus();
        return;
    }

    document.getElementById('new_comment_btn').disabled = true;
    console.log(comment);
    let ret = await fetch_timo('/api/comment', {method: 'POST', body: JSON.stringify(comment)});
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
    else
        load_captcha();
}

window.set_notify = async function(id_, val)
{
    console.log(`set notify ${id_}: ${val}`);
    let todo = {};
    todo.cmd = 'set_notify';
    todo.val = [id_, val];
    todo.url = window.location.pathname.slice(1);
    todo.email = document.getElementById('comment.email').value.toLowerCase();
    todo.captcha_id = captcha_id;
    todo.captcha_code = document.getElementById('comment.captcha').value;
    todo.sid = await db.get('var', 'sid');
    if (!todo.email) {
        alert('Please input your email!');
        return;
    }
    if (captcha_en && (!todo.captcha_id || !todo.captcha_code)) {
        alert('This operation requires a captcha.');
        document.getElementById("comment.captcha").focus();
        return;
    }

    bkup.email = todo.email;
    await db.set('var', 'bkup', bkup);
    document.getElementById(`set_notify_btn_${id_}`).disabled = true;

    console.log(todo);
    let ret = await fetch_timo('/api/comment', {method: 'POST', body: JSON.stringify(todo)});
    if (ret == null) {
        alert('set_notify: error');
        return;
    }
    if (ret.success) {
        alert(ret.success);
        location.reload();
    } else if (ret.error)
        alert(ret.error);
    else
        alert('Unknown error!');
}

window.delete_comment = async function(id_)
{
    console.log(`delete_comment ${id_}`);
    let todo = {};
    todo.cmd = 'delete';
    todo.cid = id_;
    todo.url = window.location.pathname.slice(1);
    todo.email = document.getElementById('comment.email').value.toLowerCase();
    todo.captcha_id = captcha_id;
    todo.captcha_code = document.getElementById('comment.captcha').value;
    todo.sid = await db.get('var', 'sid');
    if (!todo.email) {
        alert('Please input your email!');
        return;
    }
    if (captcha_en && (!todo.captcha_id || !todo.captcha_code)) {
        alert('This operation requires a captcha.');
        document.getElementById("comment.captcha").focus();
        return;
    }

    bkup.email = todo.email;
    await db.set('var', 'bkup', bkup);
    document.getElementById(`delete_comment_btn_${id_}`).disabled = true;

    console.log(todo);
    let ret = await fetch_timo('/api/comment', {method: 'POST', body: JSON.stringify(todo)});
    if (ret == null) {
        alert('delete_comment: error');
        return;
    }
    if (ret.success) {
        alert(ret.success);
        location.reload();
    } else if (ret.error)
        alert(ret.error);
    else
        alert('Unknown error!');
}

window.login = async function()
{
    console.log(`login`);
    let todo = {};
    todo.cmd = 'login';
    todo.url = window.location.pathname.slice(1);
    todo.email = document.getElementById('comment.email').value.toLowerCase();
    todo.captcha_id = captcha_id;
    todo.captcha_code = document.getElementById('comment.captcha').value;
    todo.sid = await db.get('var', 'sid');

    if (!todo.email) {
        alert('Please input your email!');
        return;
    }
    if (captcha_en && (!todo.captcha_id || !todo.captcha_code)) {
        alert('This operation requires a captcha.');
        document.getElementById("comment.captcha").focus();
        return;
    }
    
    bkup.email = todo.email;
    await db.set('var', 'bkup', bkup);
    document.getElementById('login_btn').disabled = true;

    console.log(todo);
    let ret = await fetch_timo('/api/session', {method: 'POST', body: JSON.stringify(todo)});
    if (ret == null) {
        alert('set_notify: error');
        return;
    }
    if (ret.success) {
        alert(ret.success);
        location.reload();
    } else if (ret.error)
        alert(ret.error);
    else
        alert('Unknown error!');
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
        article.summary = update_link(md_conv.makeHtml(article.summary), article.url);
        app_body.innerHTML += index_template(article);
    }
}

async function load_article(url)
{
    console.log('load article: ' + url);
    window.bkup = await db.get('var', 'bkup');
    window.sid = await db.get('var', 'sid');
    if (!bkup)
        bkup = {};
    bkup.m_hash = await sha1(new TextEncoder().encode(bkup.email));

    let article = await fetch_timo('/api/read-article?url=' + url.slice(1));
    if (article == null) {
        alert('read-article: error');
        return;
    }

    //console.log(article);
    captcha_en = article.conf.captcha;
    document.title = article.title + " | Duke's Blog";
    article.body = update_link(md_conv.makeHtml(article.body), url);

    let app_body = document.querySelector('app-body');
    app_body.innerHTML = article_template(article);

    if (article.comments) {
        let comments_body = document.querySelector('comments');
        for (let comment of article.comments) {
            comment.body = DOMPurify.sanitize(md_conv.makeHtml(comment.body));
            comments_body.innerHTML += comment_template(comment);
        }
    }

    if (bkup) {
        document.getElementById('comment.name').value = bkup.name ? bkup.name : '';
        document.getElementById('comment.email').value = bkup.email ? bkup.email : '';
        document.getElementById('comment.site').value = bkup.site ? bkup.site : '';
    }
}

window.restore_comment_body = function()
{
    if (bkup.body) {
        document.getElementById('comment.body').value = bkup.body;
        alert("Restore successed");
    } else {
        alert("No backup for restore");
    }
}

window.load_captcha = async function()
{
    console.log('load captcha');
    let captcha_btn = document.getElementById('captcha_btn');
    if (captcha_btn)
        captcha_btn.disabled = true;

    let captcha = await fetch_timo('/api/get-captcha');
    if (captcha == null) {
        alert('get-captcha: error');
        if (captcha_btn)
            captcha_btn.disabled = false;
        return;
    }
    captcha_id = captcha.id;
    document.getElementById('captcha_show').innerHTML = `<img src="data:image/jpeg;base64,${captcha.img}">`
    console.log(`captcha_id: ${captcha_id}`);
}

window.click_link = function(url)
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
};

window.addEventListener('popstate', function(e) {
    load_app_body("refresh");
});

