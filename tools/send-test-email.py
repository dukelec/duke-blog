#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

import sys, os
from datetime import datetime
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from conf.gconf import gconf
from api.sub.helper import *

os.chdir(os.path.dirname(__file__))

# 'date'
notify_tpl = lambda d : f"""\
<html><body>

<p>Test email send at: {d['date']}</p>

</body></html>
"""

html = notify_tpl({'date': datetime.datetime.today().strftime('%Y-%m-%d %H:%M:%S')})

print(f"Send test email to admin: {gconf['admin']}:\n\n{html}\n")

email_to(gconf['admin'][0], gconf['admin'][1], 'Test Email', html)

