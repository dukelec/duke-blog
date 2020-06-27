#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import cgi, sys, os, json, random, string, datetime
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from conf.gconf import gconf
from .tpl import *
from .crypt import *


def random_string(len_=6):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for i in range(len_))


def cal_comment_id(comments_dir, reply_to):
    if not reply_to:
        ids = [int(x.split('_')[0].split('.')[0]) for x in os.listdir(comments_dir)]
        return str(max(ids)+1) if len(ids) else '1'
    else:
        s = reply_to.split('.')
        if (len(s) != 1 and len(s) != 2) or not s[0].isdigit():
            return None
        floor = s[0] + '.' # '2.1' -> '2.'
        ids = [int(x.split('_')[0].split('.')[1]) for x in os.listdir(comments_dir) if x.startswith(floor)]
        return floor + (str(max(ids)+1) if len(ids) else '1')


def email_to(name, email, subject, html):
    message = MIMEMultipart()
    message["Subject"] = subject
    message["From"] = f"{gconf['smtp']['name']} <{gconf['smtp']['user']}>"
    message["To"] = f"{name} <{email}>" if name else f"{email}"

    if not gconf['smtp']['test']:
        message.attach(MIMEText(html, "html"))
        context = ssl.create_default_context()
        try:
            with smtplib.SMTP_SSL(gconf['smtp']['host'], gconf['smtp']['port'], context=context) as server:
                server.login(gconf['smtp']['user'], gconf['smtp']['password'])
                server.sendmail(message["From"], message["To"], message.as_string())
        except:
            print(f"email to {message['To']}, subject: {subject}\n{html}", file=sys.stderr)
            with open("tmp/.smtp_err_log", "a") as file:
                file.write("\n" + ("---" * 20) + "\n")
                file.write(f"email to {message['To']}, subject: {subject}, {datetime.datetime.now()}\n{html}")
            return False
    else:
        print(f"email to {message['To']}, subject: {subject}\n{html}", file=sys.stderr)
    return True


def new_comment_notify(url, comment_id):
    comments_dir = '../articles/' + url + '/_comments'

    with open(f'{comments_dir}/{comment_id}/_metadata', 'r') as file:
        comment = json.loads(file.read())
    reply_to = comment['reply_to']
    reply_email = None
    if reply_to and os.path.exists(f'{comments_dir}/{reply_to}'):
        with open(f'{comments_dir}/{reply_to}/_metadata', 'r') as file:
            comment_to = json.loads(file.read())
        if comment_to['notify']:
            reply_email = decrypt(comment_to['m_cipher'])

    if reply_email and reply_email != decrypt(comment['m_cipher']):
        html = comment_notify_tpl({'name': comment_to['name'], 'url': url})
        email_to(comment_to['name'], reply_email, "There is a new reply to your comment", html)

    if gconf['notify'] != 'none' and gconf['admin'][1] != reply_email:
        html = comment_notify_admin_tpl({'comment_id': comment_id, 'url': url})
        email_to(gconf['admin'][0], gconf['admin'][1], "New comment verified", html)

