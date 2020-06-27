#!/usr/bin/env python3

gconf = {
    "captcha": {
        "length": 6,
        "timeout": 5*60         # sec
    },
    "session": {
        "timeout": 15*24*60*60  # sec
    },
    "comment": {
        "review": "email",      # "none", "manual", "email", "email+manual"
        "timeout": 30*60,       # sec, timeout for email review
        "captcha": True
    },
    "smtp": {
        "test": True,           # True: not send email, print to log
        "host": "smtp.gmail.com",
        "port": 465,
        "user": "noreply@dukelec.com",
        "password": "xxxxxxxx",
        "name": "Duke Blog"
    },
    "cipher": {                 # aes_256_cbc
        "key": "0000000000000000000000000000000000000000000000000000000000000000",
        "iv": "00000000000000000000000000000000"
    },

    "url": "https://blog.d-l.io",
    "admin": ["Duke", "d@d-l.io"],
    "notify": "normal"          # "none", "normal", "verbose"
}
