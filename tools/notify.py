#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os, json
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from conf.gconf import gconf
from api.sub.crypt import *
from api.sub.helper import *

os.chdir(os.path.dirname(__file__))

# 'name', 'url', 'title'
notify_tpl = lambda d : f"""\
<html><body>

<p>Hi {d['name']}, I have a new post on my blog, please have a look:</p>

<p>Title: {d['title']}</p>
<p><a href="{gconf['url']}/{d['url']}">{gconf['url']}/{d['url']}</a></p>

<p>If you don't want to continue receiving this, you can click the button next to your comment to close it:</p>
<p><a href="{gconf['url']}/subscribe">{gconf['url']}/subscribe</a></p>
<p>(If you're not currently logged in, you'll need to log in with your email address to continue.)</p>

<p>If you encounter any problems, you can email me at {gconf['admin'][1]} to get help.</p>

</body></html>
"""

url = sys.argv[1] if len(sys.argv) >= 2 else None
test = (sys.argv[2] == '-t') if len(sys.argv) >= 3 else False
article_dir = f'../articles/{url}'
comments_dir = f'../articles/subscribe/_comments'

if not url:
    print(f'Usage: {sys.argv[0]} new_url [-t]')
    print(f' -t: test only')
    exit(-1)

if not os.path.exists(comments_dir):
    print(f'No subscribe')
    exit(-1)

with open(article_dir + '/_metadata', 'r') as file:
    a_metadata = json.loads(file.read())

emails = []
for id_ in os.listdir(comments_dir):
    if '_' in id_:
        continue
    comment_dir = f'{comments_dir}/{id_}'
    with open(comment_dir + '/_metadata', 'r') as file:
        comment = json.loads(file.read())
    email = decrypt(comment['m_cipher'])
    if email and email not in emails:
        emails.append(email)
        print(f'{id_}: {email}, test: {test}')
        html = notify_tpl({'name': comment['name'], 'url': url, 'title': a_metadata['title']})
        if test:
            print('------------------------')
            print(html)
            print('------------------------\n')
        else:
            email_to(comment['name'], email, 'New Article Notice', html)

