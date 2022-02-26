openssl req -new -newkey rsa:2048 -nodes -out mydomain.csr -keyout https-tst.key
openssl x509 -req -days 365 -in mydomain.csr -signkey https-tst.key -out https-tst.cert
rm mydomain.csr
