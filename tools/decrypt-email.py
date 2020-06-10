#!/usr/bin/env python3

import sys, os, json
from Crypto.Cipher import AES
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from gconf import gconf

try:
    with open(sys.argv[1], 'r') as file:
        comment = json.loads(file.read())
except:
    print(f'Usage: {sys.argv[0]} path/to/comments/_metadata')
    exit(-1)

def get_cipher():
    return AES.new(bytes.fromhex(gconf['cipher']['key']), AES.MODE_CBC, bytes.fromhex(gconf['cipher']['iv']))

def _unpad(d):
    return d[:-d[-1]].decode(encoding="utf-8")


email_cb = bytes.fromhex(comment['email'])
email_p = get_cipher().decrypt(email_cb)
email = _unpad(email_p)

print(f'plaintext email: {email}')

