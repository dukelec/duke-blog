#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os, json, time, random, base64, filelock
from captcha.image import ImageCaptcha
from conf.gconf import gconf


def get():
    ms_s = str(time.monotonic_ns())[:-6]
    code = ''.join(random.choice('02345689') for i in range(gconf['captcha']['length']))

    ic = ImageCaptcha()
    img = ic.generate(code, 'jpeg').read()

    dat = {
        'id': ms_s,
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
            since = max(int(ms_s) - gconf['captcha']['timeout']*1000, 0)
            cl = dict(filter(lambda elem: int(elem[0]) >= since, cl.items()))
            cl[ms_s] = code
            with open('tmp/.captcha', 'w') as file:
                file.write(json.dumps(cl, indent=2, ensure_ascii=False, sort_keys=False))

    except filelock.Timeout:
        print(f'create captcha failed: filelock.Timeout', file=sys.stderr)
        return None
    return dat


def verify(ms_s, code):
    if not isinstance(ms_s, str) or not isinstance(code, str):
        return False
    ret = False
    lock = filelock.FileLock('tmp/.captcha_lock', timeout=5)
    try:
        with lock:
            if not os.path.exists('tmp/.captcha'):
                return False

            with open('tmp/.captcha', 'r') as file:
                cl_ori = json.loads(file.read())

            now_s = str(time.monotonic_ns())[:-6]
            since = max(int(now_s) - gconf['captcha']['timeout']*1000, 0)
            cl = dict(filter(lambda elem: int(elem[0]) >= since, cl_ori.items()))
            if ms_s in cl:
                if cl[ms_s] == code:
                    ret = True
                del cl[ms_s]
            if len(cl) != len(cl_ori):
                with open('tmp/.captcha', 'w') as file:
                    file.write(json.dumps(cl, indent=2, ensure_ascii=False, sort_keys=False))
        return ret

    except filelock.Timeout:
        print(f'verify captcha failed: filelock.Timeout', file=sys.stderr)
        return None

    
