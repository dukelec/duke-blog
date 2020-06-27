#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os, json, time, filelock
from conf.gconf import gconf
from .helper import random_string

# code: random string
# pid: ms_s + code (random string)
#
# .pend:
# {
#    pid: {'cmd': cmd, 'url': url, 'id': comment_id}
#    ...
# }
#


def get(pid):
    if not isinstance(pid, str):
        return False

    ret = None
    ms_s = str(time.monotonic_ns())[:-6]
    lock = filelock.FileLock('tmp/.pend_lock', timeout=5)
    try:
        with lock:
            if not os.path.exists('tmp/.pend'):
                return False
            with open('tmp/.pend', 'r') as file:
                pl_ori = json.loads(file.read())
            since = max(int(ms_s) - gconf['comment']['timeout']*1000, 0)
            pl = dict(filter(lambda elem: int(elem[0][:-6]) >= since, pl_ori.items()))
            if pid in pl:
                ret = pl[pid]
                del pl[pid]
            if len(pl_ori) != len(pl):
                with open('tmp/.pend', 'w') as file:
                    file.write(json.dumps(pl, indent=2, ensure_ascii=False, sort_keys=False))
        return ret

    except filelock.Timeout:
        return None


def add(todo, pid):
    ms_s = str(time.monotonic_ns())[:-6]
    lock = filelock.FileLock('tmp/.pend_lock', timeout=5)
    try:
        with lock:
            if not os.path.exists('tmp/.pend'):
                pl = {}
            else:
                with open('tmp/.pend', 'r') as file:
                    pl = json.loads(file.read())
            since = max(int(ms_s) - gconf['comment']['timeout']*1000, 0)
            pl = dict(filter(lambda elem: int(elem[0][:-6]) >= since, pl.items()))
            pl[pid] = todo
            with open('tmp/.pend', 'w') as file:
                file.write(json.dumps(pl, indent=2, ensure_ascii=False, sort_keys=False))
        return True

    except filelock.Timeout:
        return False

