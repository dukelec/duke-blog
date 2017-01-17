#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys, os
import mimetypes
import json
import subprocess
import threading
import time

import requests
import dateutil.parser

URL = 'http://blog.dukelec.com'
#DB = '/var/www/localhost/ng-blog/db/articles'
DB = '/var/www/blog.dukelec.com/duke-blog-work/db/articles'

index_template = '''
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Duke's Blog</title>

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link href="/bootstrap.min.css" rel="stylesheet">
  <link href="/blog.css" rel="stylesheet">
</head>
<body>
    <div class="container">
      <div class="blog-header">
        <a href="/archive/" style="text-decoration:none;"><h1 class="blog-title">Duke's Blog</h1></a>
        <p class="lead blog-description">Learning is a life long journey.</p>
      </div>
      <div class="row">
        <div class="col-sm-10 blog-main">
          %s
        </div><!-- /.blog-main -->
      </div><!-- /.row -->
    </div><!-- /.container -->
</body>
</html>
'''

articles_template = '''
<div class="blog-post" >
	<a href="%s" style="text-decoration:none;"><h2 class="blog-post-title">%s</h2></a>
	<p class="blog-post-meta">Languages: %s | Categories: %s | Tags: %s | %s | Count: %s</p>
	<p>%s</p>
</div>
'''

article_template = '''
<div class="blog-post">

  <h2 class="blog-post-title">%s</h2>
  <p class="blog-post-meta">Languages: %s | Categories: %s | Tags: %s | %s | Count: %s</p>
  <div>%s</div>

</div><!-- /.blog-post -->

<h3>Comments:</h3>
%s

<br/>

<p>Original link: <a href="/%s" style="text-decoration:none;">http://blog.dukelec.com/%s</a></p>
'''


comments_template = '''
<div>
  <div>
	  <p><small>#%s, %s, %s &lt;%s&gt; wrote:</small></p>
	  <p>%s</p>
  </div>
</div>
'''


articles_html = ''


def attributes2Array(attrs_str):
    attrs = {}
    attrs['permissions'] = []
    attrs['languages'] = []
    attrs['categories'] = []
    attrs['tags'] = []
    
    for i in attrs_str.split(','):
        if i.startswith('P'):
            attrs['permissions'].append(i[2:])
        elif i.startswith('L'):
            attrs['languages'].append(i[2:])
        elif i.startswith('C'):
            attrs['categories'].append(i[2:])
        elif i.startswith('T'):
            attrs['tags'].append(i[2:])
    return attrs

def escapeHtml(unsafe):
    return unsafe.replace('&', '&amp;')\
                 .replace('<', '&lt;')\
                 .replace('>', '&gt;')\
                 .replace('"', '&quot;')\
                 .replace('\'', '&#039;')

# get index
articles = requests.get(URL + '/api/read-articles').json()['articles']

for a in articles:
    attrs = attributes2Array(a['attributes'])
    date = dateutil.parser.parse(a['date']).strftime("%b %d, %Y, %I:%M:%S %p")
    articles_html += articles_template % (a['url'], a['title'], ', '.join(attrs['languages']),
                                        ', '.join(attrs['categories']), ', '.join(attrs['tags']),
                                        date, a['count'], a['summary'])
    
    article = requests.get(URL + '/api/read-article?url=' + a['url']).json()['article']
    replys = requests.get(URL + '/api/read-replys?url=' + a['url']).json()['replys']
    
    comments_html = ''
    
    for c in replys:
        c_date = dateutil.parser.parse(c['date']).strftime("%b %d, %Y, %I:%M:%S %p")
        comments_html += comments_template % (c['id'], c_date, c['name'], c['email'], c['body'])
    
    if article['format'] == 'plain':
        body = '<pre>%s</pre>' % escapeHtml(article['body'])
    else:
        body = article['body']
        #TODO:  add highlight code
    
    article_html = article_template % (a['title'], ', '.join(attrs['languages']),
                                        ', '.join(attrs['categories']), ', '.join(attrs['tags']),
                                        date, a['count'], body, comments_html, a['url'], a['url'])
    
    template = index_template.replace('<title>Duke\'s Blog</title>', '<title>%s - Duke\'s Blog</title>' % a['title'], 1)
    
    subprocess.run('mkdir %s' % a['url'], shell=True)
    with open('%s/index.html' % a['url'], 'w') as f:
        f.write(template % article_html)
    
    subprocess.run('cp -r %s/%s/* %s/' % (DB, a['url'], a['url']), shell=True)
    subprocess.run('rm -r %s/_content %s/comments' % (a['url'], a['url']), shell=True)

with open('index.html', 'w') as f:
    f.write(index_template % (articles_html + '<br><p>Original link: <a href="/" style="text-decoration:none;">http://blog.dukelec.com</a></p>'))


