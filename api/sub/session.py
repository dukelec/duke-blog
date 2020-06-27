#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os, json, time, filelock
from conf.gconf import gconf
from .helper import random_string

# sid: sec_s (time when add) + code (random string)
#
# .session:
# {
#    email1: [sid1, sid2 ...]
#    ...
# }
#


def verify(email, sid):
    if not isinstance(email, str) or not isinstance(sid, str):
        return False

    sec_s = str(time.time_ns())[:-9]
    lock = filelock.FileLock('tmp/.session_lock', timeout=5)
    try:
        with lock:
            if not os.path.exists('tmp/.session'):
                return False

            with open('tmp/.session', 'r') as file:
                sl = json.loads(file.read())

            if email not in sl:
                return False
            since = max(int(sec_s) - gconf['session']['timeout'], 0)
            sl[email] = list(filter(lambda elem: int(elem[:-6]) >= since, sl[email]))
            if sid not in sl.get(email, []):
                return False
        return True

    except filelock.Timeout:
        return False


def add(email, sid):
    lock = filelock.FileLock('tmp/.session_lock', timeout=5)
    try:
        with lock:
            if not os.path.exists('tmp/.session'):
                sl = {}
            else:
                with open('tmp/.session', 'r') as file:
                    sl = json.loads(file.read())

            if email not in sl:
                sl[email] = []
            sl[email].append(sid)

            with open('tmp/.session', 'w') as file:
                file.write(json.dumps(sl, indent=2, ensure_ascii=False, sort_keys=False))
        return True

    except filelock.Timeout:
        return False


def delete(email, sid, del_all=False):
    lock = filelock.FileLock('tmp/.session_lock', timeout=5)
    try:
        with lock:
            if not os.path.exists('tmp/.session'):
                return True

            with open('tmp/.session', 'r') as file:
                sl = json.loads(file.read())

            if email not in sl:
                return True
            if del_all:
                del sl[email]
            else:
                sl[email].remove(sid)

            with open('tmp/.session', 'w') as file:
                file.write(json.dumps(sl, indent=2, ensure_ascii=False, sort_keys=False))
        return True

    except filelock.Timeout:
        return False


def clean_up():
    lock = filelock.FileLock('tmp/.session_lock', timeout=5)
    try:
        with lock:
            if not os.path.exists('tmp/.session'):
                return True

            with open('tmp/.session', 'r') as file:
                sl = json.loads(file.read())

            since = max(int(sec_s) - gconf['session']['timeout'], 0)

            for email in sl:
                sl[email] = list(filter(lambda elem: int(elem[:-6]) >= since, sl[email]))
                if len(sl[email]) == 0:
                    del sl[email]
            with open('tmp/.session', 'w') as file:
                file.write(json.dumps(sl, indent=2, ensure_ascii=False, sort_keys=False))
        return True

    except filelock.Timeout:
        return False
    
