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

# 'comment_id', 'url', 'title'
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
article_dir = f'../articles/{url}'
comments_dir = f'../articles/{url}/_comments'

if not url or not os.path.exists(comments_dir):
    print(f'Usage: {sys.argv[0]} title_url')
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
    if email not in emails:
        emails.append(email)
        print(f'{id_}: {email}')
        html = notify_tpl({'name': comment['name'], 'url': url, 'title': a_metadata['title']})
        email_to(comment['name'], email, 'New Article Notice', html)

