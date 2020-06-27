#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

from Crypto.Cipher import AES
from conf.gconf import gconf

def mask_email(email):
    name, domain = email.split('@')
    d1, d2 = domain.rsplit('.', 1)
    return name[:int(len(name)/2)] + '~@' + d1[:int(len(d1)/2)] + '~.' + d2

def get_cipher():
    return AES.new(bytes.fromhex(gconf['cipher']['key']), AES.MODE_CBC, bytes.fromhex(gconf['cipher']['iv']))

def _pad(d):
    #if isinstance(d, str):
    d = bytes(d, encoding="utf-8")
    bs = 16
    p_cnt = bs - len(d) % bs
    return d + bytes([p_cnt]) * p_cnt

def _unpad(d):
    return d[:-d[-1]].decode(encoding="utf-8")

def encrypt(_str):
    return get_cipher().encrypt(_pad(_str)).hex()

def decrypt(_hex):
    return _unpad(get_cipher().decrypt(bytes.fromhex(_hex)))

