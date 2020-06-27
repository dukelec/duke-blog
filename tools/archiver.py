#!/usr/bin/env python
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os, json, markdown, datetime, subprocess
from html_sanitizer import Sanitizer
import AdvancedHTMLParser
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from conf.gconf import gconf
from api.sub.crypt import *

archive_path = f'{os.path.dirname(__file__)}/../archive'
if not os.path.exists(archive_path):
    os.makedirs(archive_path)
os.chdir(archive_path)

md_extensions = ['extra']


main_tpl = lambda d : f'''\
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{d.get('title', "Duke's Blog")}</title>
  <!--base href="/"-->

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/png" href="favicon.png">
  <link href="/src/lib/bootstrap.min.css" rel="stylesheet">
  <link href="/src/blog.css" rel="stylesheet">
  <link href="/src/lib/highlight-10.0.3.css" rel="stylesheet">
</head>
<body>

  <div class="container">
    <div class="blog-header">
      <a href="/archive/" class="blog-title"><h1 class="blog-title">Duke's Blog</h1></a>
      <p class="lead blog-description">Learning is a life long journey.</p>
      <a href="/subscribe"><small class="pull-right">Subscribe</small></a>
    </div>
    <div class="row">
      <div class="col-sm-12 blog-main">
        <app-body>

{d['body']}

        </app-body>
      </div><!-- /.blog-main -->
    </div><!-- /.row -->
  </div><!-- /.container -->
</body>
</html>
'''

index_tpl = lambda d : f'''\
<div class="blog-post" >
	<a href="/archive/{d['url']}"><h2 class="blog-post-title">{d['title']}</h2></a>
	<p class="blog-post-meta">Languages: {(', ').join(d['languages'])} |
	        Categories: {(', ').join(d['categories'])} | Tags: {(', ').join(d['tags'])} |
	        {format_date(d['date'])} | Count: {d['count']}
	        {'<br>Last modified: ' + format_date(d['last']) if 'last' in d else ''}</p>
	<p>{d['summary']}</p>
</div>
'''

article_tpl = lambda d : f'''\
<div class="blog-post">

  <h2 class="blog-post-title">{d['title']}</h2>
  <p class="blog-post-meta">Languages: {(', ').join(d['languages'])} |
	        Categories: {(', ').join(d['categories'])} | Tags: {(', ').join(d['tags'])} |
	        {format_date(d['date'])} | Count: {d['count']}
	        {'<br>Last modified: ' + format_date(d['last']) if 'last' in d else ''}</p>
  <div>{d['body']}</div>

</div><!-- /.blog-post -->

<h3>Comments:</h3>
<comments>{d['comments_body']}</comments>

<br/>

<div class="form-horizontal">
  <div class="form-group">
    <div class="col-sm-offset-0 col-sm-8">
      <p>Please visit the original link: <a href="/{d['url']}" style="text-decoration:none;">/{d['url']}</a></p>
    </div>
  </div>
</div>
'''

comment_tpl = lambda d : f'''\
  <div style="padding-left: {'10' if '.' in d['id'] else '0'}px;">
	  <p><small>#{d['id']}, {format_date(d['date'])}, {d['name']} &lt;{d['m_show']}&gt; wrote:</small></p>
	  <p>{d['body']}</p>
  </div>
'''

def format_date(date_):
    d = datetime.datetime.fromisoformat(date_.split('+')[0])
    return d.strftime("%A, %B %d, %Y")

def update_link(html, url):
    parser = AdvancedHTMLParser.AdvancedHTMLParser()
    parser.parseStr(html)
    y = parser.getElementsCustomFilter(lambda a: 'href' in a.attributes)
    for h in y:
        if '//' not in h.href and not h.href.startswith('#'):
            h.href = f'{url}/{h.href}'
    y = parser.getElementsCustomFilter(lambda a: 'src' in a.attributes)
    for h in y:
        if '//' not in h.src and not h.src.startswith('#'):
            h.src = f'{url}/{h.src}'
    y = parser.getElementsCustomFilter(lambda a: 'poster' in a.attributes)
    for h in y:
        if '//' not in h.poster and not h.poster.startswith('#'):
            h.poster = f'{url}/{h.poster}'
    return parser.getHTML()


print('Process Index...')
articles = json.loads(subprocess.getoutput("../api/read-index --json"))

app_body = ''
for article in articles:
    article['summary'] = markdown.markdown(article['summary'], extensions=md_extensions, output_format='html5')
    article['summary'] = update_link(article['summary'], article['url'])
    app_body += index_tpl(article)

full_html = main_tpl({'body': app_body})

with open('index.html', 'w') as f:
    f.write(full_html)


for a in articles:
    app_body = ''
    print(f"Process {a['url']}...")
    article = json.loads(subprocess.getoutput(f"../api/read-article {a['url']}"))
    article['url'] = a['url']
    article['body'] = markdown.markdown(article['body'], extensions=md_extensions, output_format='html5')
    article['body'] = update_link(article['body'], a['url'])

    article['comments_body'] = ''
    for comment in article.get('comments', {}):
        sanitizer = Sanitizer()
        comment['body'] = markdown.markdown(comment['body'], extensions=md_extensions, output_format='html5')
        comment['body'] = sanitizer.sanitize(comment['body'])
        article['comments_body'] += comment_tpl(comment)

    app_body += article_tpl(article)
    full_html = main_tpl({'body': app_body, 'title': f"{article['title']} | Duke's Blog"})

    if not os.path.exists(a['url']):
        os.makedirs(a['url'])
    with open(f"{a['url']}/index.html", 'w') as f:
        f.write(full_html)


