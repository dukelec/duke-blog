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

original_template = '''
<p>Original link: <a href="/%s" style="text-decoration:none;">http://blog.dukelec.com/%s</a></p>
'''

articles_url = []

browser.get(URL)
sleep(1)
index_lines = browser.page_source.splitlines()

for i in range(len(index_lines)):
    line = index_lines[i]
    if line.find("click_link('/')") != -1:
        print('index: replace head title')
        index_lines[i] = '      <a href="/archive/" style="text-decoration:none;"><h1 class="blog-title">Duke\'s Blog</h1></a>'
        continue
    
    if line.find('<script type="text/javascript" src="/') != -1:
        print('index: remove javascript')
        index_lines[i] = index_lines[i].replace('<script', '<!--script')
        index_lines[i] = index_lines[i].replace('</script>', '</script-->')
        continue
        
    if line.find("</div><!-- /.blog-main -->") != -1:
        print('index: replace footer')
        index_lines[i] = '<br><p>Original link: <a href="/" style="text-decoration:none;">http://blog.dukelec.com</a></p>\n</div><!-- /.blog-main -->'
        continue
    
    click_start_pos = line.find("click_link(")
    if click_start_pos == -1:
        continue
    url_start_pos = click_start_pos + len("click_link('")
    url_end_pos = line.find("'", url_start_pos)
    title_start_pos = line.find(">", url_end_pos) + 1
    title_end_pos = line.find("</h2>", title_start_pos)
    url = line[url_start_pos: url_end_pos]
    title = line[title_start_pos: title_end_pos]
    articles_url.append(url)
    print('index: replace: url: ' + url + ', title: ' + title)
    index_lines[i] = '\t<a href="%s" style="text-decoration:none;"><h2 class="blog-post-title">%s</h2></a>' % (url, title);

with open('index.html', 'w') as f:
    f.write('\n'.join(index_lines))


for url in articles_url:
    print('processing: ' + url + ' ...')
    browser.get(URL + '/' + url)
    sleep(1)
    article_lines = browser.page_source.splitlines()
    
    for i in range(len(article_lines)):
        line = article_lines[i]
        if line.find("click_link('/')") != -1:
            print('article: replace head title')
            article_lines[i] = '      <a href="/archive/" style="text-decoration:none;"><h1 class="blog-title">Duke\'s Blog</h1></a>'
            continue
        
        if line.find('<script type="text/javascript" src="/') != -1:
            print('article: remove javascript')
            article_lines[i] = article_lines[i].replace('<script', '<!--script')
            article_lines[i] = article_lines[i].replace('</script>', '</script-->')
            continue
        
        if line.find('onclick="write_comment()">Submit</button>') != -1:
            print('article: replace submit button')
            article_lines[i] = '<p>Original link: <a href="/%s" style="text-decoration:none;">http://blog.dukelec.com/%s</a></p>' % (url, url)
    
    if not os.path.exists(url):
        os.makedirs(url)
    with open('%s/index.html' % url, 'w') as f:
        f.write('\n'.join(article_lines))

