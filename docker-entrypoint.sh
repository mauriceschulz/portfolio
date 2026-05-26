#!/bin/sh
set -e

cp -a /var/www/html/public-build/. /var/www/html/public/

exec "$@"
