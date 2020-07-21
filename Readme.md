CDBLOG - A small federalism blog backend
---------------

What is federalism?

The social media we engage with on a daily basis is almost always in small circles. Thousands of forums, for example, each of which requires a separate registration.
Another example is Facebook, Twitter and Sina Weibo, each of which has to register separately and has difficulties in communicating with each other.
WeChat, in particular, is to be singled out, as its Moments and Official Accounts are completely contrary to the spirit of the Internet.
Even products from the same company, such as QQ and WeChat, can't communicate with each other. The ideas you share on the Moments can't be freely spread on the Internet either.

A representative example of federalism is Email, a very basic and popular service from the early days of the Internet to the present day.
You can sign up for a free or paid account with any service provider, use the service provider or your own domain name, or build your own server.
Information can be exchanged easily between different service providers.

Already, more and more people are resenting the small-circle platform and are starting to build federal-style social platforms to replace Facebook, Twitter, WeChat Moments, and so on.
A more representative work is Mastodon, it is similar to Email. You only need to register in any one of the service providers (or self-built). You can interact with users on any Mastodon server without any hindrance, such as comment, quote, etc.
(Replacing the IM is represented by Matrix (Element), etc.).
Mastodon is also interoperable with other open source social platforms, through an open API protocol.


However, I still don't think it's free enough, and the way I've envisioned it doesn't have to be bound by any API, it just has to follow a similar pattern, and visitors don't have to register to interact with it.

 - Bloggers can register for a blog account with any service provider that uses this pattern, or they can set up their own server without registering.
 - Visitors can leave a comment without registering. The first time they leave a message, they can enter their name, email address, and their blog address (optional) and the system will send a verification email.
 - The verification information is stored in the browser, and visitors can leave a comment (or other interaction) again within a certain period of time (for example, half a month) without having to verify it again.
 - Visitors can subscribe to the blog and receive emails when new posts are posted.
 - Visitors can reply to each other and the system will send email notifications to each other.
 - Visitors can visit each other's blogs and expand their social circle through the blog addresses they leave when they leave comments.
 - Reading emails from mailbox is like browsing Facebook homepage (or WeChat Moments), such emails can be enabled for auto-categorization and will not interfere with other important emails.

This blog realizes this idea, although it is relatively rudimentary, but I believe that as long as more and more people agree, more and more similar pattern of excellent platform will come out, more features and better experience.

In addition to the features mentioned above, this blog also supports:

 - Message addresses are protected from direct display to protect privacy and prevent spam.
 - Fully static archive snapshot, compatible with older browsers and indexed by more search engines.
 - Data is organized into directories and files for easy editing, deployment, and version control. You can also browse articles directly on GitHub and other platforms. (If I have an accident and the server is down, there is a platform to keep my blog going.)
 - The posts and comments support Markdown syntax.
 - Captcha validation is supported for operations involving mail sending.


## Usage

 - Please clone the master branch to floder like `/var/www/YOUR-BLOG`.
 - Create one ssl vhost config for Apache, set the `DocumentRoot` to `/var/www/YOUR-BLOG`.
 - Install python packages (pip3 install): `captcha`, `html_sanitizer`, `AdvancedHTMLParser`, `markdown`.
 - Copy `conf/gconf.example.py` to `conf/gconf.py`, change the `smtp`, `url` and `admin` in the config, and update items under `cipher` to random hex string (keep the same length).
 - Post new blog by copy any article under the articles folder, then change the content in it.
 - Run `tools/archiver.py` to update the static snapshots.
 - Run `chown -R apache .` in the top of the source folder.
 - Run `tools/notify.py new_url [-t]` to send notification email to your subscribers, add `-t` for test without send emails.

