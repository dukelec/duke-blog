# sudo pip3.4 install captcha

change permissions

# emerge -av MIME-Lite # for gentoo, or refer: http://www.logix.cz/michal/devel/smtp-cli/


cd dist/
cp ../.htaccess ./
ln -s ../api api
ln -s ../db db
cp ../src/*.js ./
cd ..

