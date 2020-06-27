#!/usr/bin/env python
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os, json, markdown, datetime, subprocess
from hashlib import sha1
from html_sanitizer import Sanitizer
import AdvancedHTMLParser
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from conf.gconf import gconf
from api.sub.crypt import *

os.chdir(f'{os.path.dirname(__file__)}')


print('start ...')

for url in os.listdir('../articles'):
    article_dir = '../articles/' + url

    with open(article_dir + '/_metadata', 'r') as file:
        metadata_lines_ori = file.readlines()
    
    metadata_lines = [x for x in metadata_lines_ori if (not '"format' in x)]
    if len(metadata_lines) != len(metadata_lines_ori):
        print(f"Update {url}...")
        with open(article_dir + '/_metadata', 'w') as file:
            file.write(''.join(metadata_lines))

    
    if os.path.exists(f"../articles/{url}/_comments"):
        for id_ in os.listdir(f"../articles/{url}/_comments"):
            comment_dir = f"../articles/{url}/_comments/{id_}"
            with open(comment_dir + '/_metadata', 'r') as file:
                comment = json.loads(file.read())
            if 'm_cipher' in comment:
                continue
            
            print(f"Update {url} -> {id_}...")
            
            comment['m_cipher'] = comment['email']
            comment['m_show'] = comment['masked']
            email = decrypt(comment['m_cipher'])
            comment['m_hash'] = sha1(bytes(email, encoding="utf-8")).hexdigest()
            comment['notify'] = True
            comment['site'] = None
            comment['reply_to'] = ''
            
            del comment['masked']
            del comment['email']
            del comment['registered']
            del comment['format']
            
            with open(comment_dir + '/_metadata', 'w') as file:
                file.write(json.dumps(comment, indent=2, ensure_ascii=False, sort_keys=False))

