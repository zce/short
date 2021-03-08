# @zce/store/short

> zce's short url store.

## Deploy

```shell
$ sudo git clone https://github.com/zce/short.git /var/www/short

$ sudo ln -s /var/www/short/nginx/nginx.conf /etc/nginx/sites-available/short.conf
$ sudo ln -s /etc/nginx/sites-available/short.conf /etc/nginx/sites-enabled/short.conf

$ sudo nginx -t
$ sudo systemctl reload nginx
```
