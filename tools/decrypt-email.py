#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os, json
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from conf.gconf import gconf
from api.sub.crypt import *

try:
    with open(sys.argv[1], 'r') as file:
        comment = json.loads(file.read())
except:
    print(f'Usage: {sys.argv[0]} path/to/comments/_metadata')
    exit(-1)

email = decrypt(comment['m_cipher'])
print(f'plaintext email: {email}')

