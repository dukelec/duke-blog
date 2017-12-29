#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys, os
import mimetypes
import json
import subprocess
import threading
import time
from time import sleep

import requests
import dateutil.parser

# download driver from: http://chromedriver.storage.googleapis.com/index.html
from selenium import webdriver
browser = webdriver.Chrome()


URL = 'http://blog.dukelec.com'

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
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-38012736-5', 'auto');
  ga('send', 'pageview');

</script>
</html>
'''

articles_template = '''
<div class="blog-post" >
	<a href="%s" style="text-decoration:none;"><h2 class="blog-post-title">%s</h2></a>
	<p class="blog-post-meta">Languages: %s | Categories: %s | Tags: %s | %s | Count: %s</p>
	<p>%s</p>
</div>
'''

original_template = '''
<p>Original link: <a href="/%s" style="text-decoration:none;">http://blog.dukelec.com/%s</a></p>
'''


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


articles_html = ''

# get index
articles = requests.get(URL + '/api/read-articles').json()['articles']

for a in articles:
    print('processing: ' + a['url'] + ' ...')
    browser.get('http://blog.dukelec.com/' + a['url'])
    sleep(1)
    
    
    attrs = attributes2Array(a['attributes'])
    date = dateutil.parser.parse(a['date']).strftime("%b %d, %Y, %I:%M:%S %p")
    articles_html += articles_template % (a['url'], a['title'], ', '.join(attrs['languages']),
                                        ', '.join(attrs['categories']), ', '.join(attrs['tags']),
                                        date, a['count'], a['summary'])
    
    article_html = browser.page_source
    article_html = article_html.replace('''<h1 class="blog-title active" routerlink="/" routerlinkactive="active">Duke's Blog</h1>''',
                                        '''<a href="/archive/" style="text-decoration:none;"><h1 class="blog-title">Duke's Blog</h1></a>''', 1)
    article_html = article_html.replace('<button class="btn btn-default" type="submit">Submit</button>',
                                        original_template % (a['url'], a['url']), 1)
    
    subprocess.run('mkdir %s' % a['url'], shell=True)
    with open('%s/index.html' % a['url'], 'w') as f:
        f.write(article_html)

with open('index.html', 'w') as f:
    f.write(index_template % (articles_html + '<br><p>Original link: <a href="/" style="text-decoration:none;">http://blog.dukelec.com</a></p>'))


