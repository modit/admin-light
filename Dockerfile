FROM modit/php

RUN apt-get install -y wget
RUN wget -O - http://nodejs.org/dist/v0.10.25/node-v0.10.25-linux-x64.tar.gz | tar -C /usr/local/ --strip-components=1 -zxv
RUN npm install -g less

WORKDIR /var/www/html

RUN rm -f /var/www/html/*
ADD .	/var/www/html

RUN ./less.sh