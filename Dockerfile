FROM modit/php

RUN apt-get install -y wget
RUN wget -O - http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-x64.tar.gz | tar -C /usr/local/ --strip-components=1 -zxv
RUN npm install -g less

RUN a2enmod rewrite

ADD default.conf /etc/apache2/sites-available/000-default.conf

RUN rm -f /var/www/html/*

WORKDIR /var/www/html

ADD .	/var/www/html
RUN ./less.sh