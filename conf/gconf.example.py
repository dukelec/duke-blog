#!/usr/bin/env python3

gconf = {
    "captcha": {
        "length": 6,
        "timeout": 30*60 # sec
    },
    "reply": {
        "need-review": False,
        "require-captcha": False
    },
    "smtp": {
        "host": "smtp.gmail.com",
        "user": "noreply@dukelec.com",
        "password": "XXXX",
        "name": "Duke Blog Server"
    },
    "cipher": {
        "key": "7f51f2cf3fce1c3ecbb01b8a9c374c8ab5f9c48035620aebf87650d35ed5b27b",
        "iv": "9bdf52a4830779a1383ac24f1b3ed054"
    }
}
