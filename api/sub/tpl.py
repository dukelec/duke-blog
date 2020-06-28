#!/usr/bin/env python3
#
# Software License Agreement (MIT License)
# Author: Duke Fong <d@d-l.io>

from conf.gconf import gconf

# 'name', 'ms_s', 'code', 'admin'
comment_verify_tpl = lambda d : f"""\
<html><body>

<p>Hi {d['name']}, please click on the following link to complete submitting your comment.</p>

<p><a href="{gconf['url']}/api/session?cmd=confirm&pid={d['pid']}">{gconf['url']}/api/session?cmd=confirm&pid={d['pid']}</a></p>

<p>If this message is not relevant to you, please ignore this message. I am very sorry to disturb you.</p>

<p>If you continue to receive such emails, please send an email to {gconf['admin'][1]} to notify me, thank you.</p>

</body></html>
"""

# 'name', 'url', 'cid'
comment_notify_tpl = lambda d : f"""\
<html><body>

<p>Hi {d['name']}, someone replied to your comment, please have a look:</p>

<p><a href="{gconf['url']}/{d['url']}">{gconf['url']}/{d['url']}</a> #{d['cid']}</p>

<p>If you don't want to continue receiving replies, you can click the button next to the comment to close it.</p>
<p>(If you're not currently logged in, you'll need to log in with your email address to continue.)</p>

<p>If you encounter any problems, you can email me at {gconf['admin'][1]} to get help.</p>

</body></html>
"""

# 'cid', 'url'
comment_notify_admin_tpl = lambda d : f"""\
<html><body>

<p>Hi {gconf['admin'][0]}, there's a new comment here, please have a look:<br>

<p><a href="{gconf['url']}/{d['url']}">{gconf['url']}/{d['url']}</a> #{d['cid']}</p>

</body></html>
"""


# 'sid', 'url', 'cid'
comment_verify_ok_tpl = lambda d : f"""\
<html>
<body>

<p>The comment has been successfully published, please have a look:</p>
<p><a href="{gconf['url']}/{d['url']}">{gconf['url']}/{d['url']}</a> #{d['cid']}</p>

<p>Before the session expires ({round(gconf['session']['timeout']/(24*60*60))} days), you can comment again without email verification.</p>
<p><small>SID: {d['sid']}, for: {d['email']}</small></p>

</body>
<script type="module">
  import {{ Idb }} from '/src/utils/idb.js';

  window.onload = async function() {{
    let db = await new Idb('blog', ['var']);
    console.log("window onload");
    await db.set('var', 'sid', '{d['sid']}');
    console.log("sid saved: {d['sid']}");
  }};
</script>
</html>
"""

# 'sid', 'url', 'pid'
login_verify_tpl = lambda d : f"""\
<html><body>

<p>Hi, please click on the following link to complete login.</p>

<p><a href="{gconf['url']}/api/session?cmd=confirm&pid={d['pid']}">{gconf['url']}/api/session?cmd=confirm&pid={d['pid']}</a></p>

<p>If this message is not relevant to you, please ignore this message. I am very sorry to disturb you.</p>

<p>If you continue to receive such emails, please send an email to {gconf['admin'][1]} to notify me, thank you.</p>

</body></html>
"""

# 'sid', 'email', 'url'
login_verify_ok_tpl = lambda d : f"""\
<html>
<body>

<p>You have successfully logged in, you can go to continue:</p>
<p><a href="{gconf['url']}/{d['url']}">{gconf['url']}/{d['url']}</a></p>

<p><small>SID: {d['sid']}, for: {d['email']}, expires after {round(gconf['session']['timeout']/(24*60*60))} days.</small></p>

</body>
<script type="module">
  import {{ Idb }} from '/src/utils/idb.js';

  window.onload = async function() {{
    let db = await new Idb('blog', ['var']);
    console.log("window onload");
    await db.set('var', 'sid', '{d['sid']}');
    console.log("sid saved: {d['sid']}");
  }};
</script>
</html>
"""

