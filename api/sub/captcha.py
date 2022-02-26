#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os, json, time, random, base64, filelock
from captcha.image import ImageCaptcha
from conf.gconf import gconf
from .helper import random_string

# captcha_id: sec_s (time when add) + code (random string)
#
# file tmp/.captcha:
# {
#    captcha_id: code,
#    ...
# }


def get():
    sec_s = str(time.time_ns())[:-9]
    captcha_id = f'{sec_s}{random_string()}'
    code = ''.join(random.choice('02345689') for i in range(gconf['captcha']['length']))

    ic = ImageCaptcha()
    img = ic.generate(code, 'jpeg').read()

    dat = {
        'id': captcha_id,
        'img': base64.b64encode(img).decode('ascii')
    }

    lock = filelock.FileLock('tmp/.captcha_lock', timeout=5)

    try:
        with lock:
            if os.path.exists('tmp/.captcha'):
                with open('tmp/.captcha', 'r') as file:
                    cl = json.loads(file.read())
            else:
                cl = {}
            since = max(int(sec_s) - gconf['captcha']['timeout'], 0)
            cl = dict(filter(lambda elem: int(elem[0][:-6]) >= since, cl.items()))
            cl[captcha_id] = code
            with open('tmp/.captcha', 'w') as file:
                file.write(json.dumps(cl, indent=2, ensure_ascii=False, sort_keys=False))

    except filelock.Timeout:
        print(f'create captcha failed: filelock.Timeout', file=sys.stderr)
        return None
    return dat


def verify(captcha_id, code):
    if not isinstance(captcha_id, str) or not isinstance(code, str):
        return False
    ret = False
    lock = filelock.FileLock('tmp/.captcha_lock', timeout=5)
    try:
        with lock:
            if not os.path.exists('tmp/.captcha'):
                return False

            with open('tmp/.captcha', 'r') as file:
                cl_ori = json.loads(file.read())

            sec_s = str(time.time_ns())[:-9]
            since = max(int(sec_s) - gconf['captcha']['timeout'], 0)
            cl = dict(filter(lambda elem: int(elem[0][:-6]) >= since, cl_ori.items()))
            if captcha_id in cl:
                if cl[captcha_id] == code:
                    ret = True
                del cl[captcha_id]
            if len(cl) != len(cl_ori):
                with open('tmp/.captcha', 'w') as file:
                    file.write(json.dumps(cl, indent=2, ensure_ascii=False, sort_keys=False))
        return ret

    except filelock.Timeout:
        print(f'verify captcha failed: filelock.Timeout', file=sys.stderr)
        return None

    
