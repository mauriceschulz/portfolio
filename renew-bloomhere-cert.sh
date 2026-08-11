#!/bin/sh
set -eu

DOMAIN=bloomhere.shop
RENEW_WINDOW_SECONDS=2592000
CERT_PATH="/etc/portfolio/ssl/${DOMAIN}.cert"

if [ -f "$CERT_PATH" ] && openssl x509 -checkend "$RENEW_WINDOW_SECONDS" -noout -in "$CERT_PATH" >/dev/null 2>&1; then
  echo "${DOMAIN} certificate is not due for renewal."
  exit 0
fi

restore_nginx() {
  docker start portfolio-nginx >/dev/null 2>&1 || true
}
trap restore_nginx EXIT

docker stop portfolio-nginx >/dev/null

docker run --rm \
  -p 443:443 \
  -v /etc/portfolio/lego:/etc/lego \
  goacme/lego run \
    --path /etc/lego \
    --email info@mauriceschulz.dev \
    --accept-tos \
    --domains bloomhere.shop \
    --domains www.bloomhere.shop \
    --tls \
    --key-type ec256 \
    --renew-days 30

cp -L /etc/portfolio/lego/certificates/bloomhere.shop.crt /etc/portfolio/ssl/bloomhere.shop.cert
cp -L /etc/portfolio/lego/certificates/bloomhere.shop.key /etc/portfolio/ssl/bloomhere.shop.key
chmod 600 /etc/portfolio/ssl/bloomhere.shop.key

trap - EXIT
docker start portfolio-nginx >/dev/null
docker exec portfolio-nginx nginx -t
docker exec portfolio-nginx nginx -s reload
