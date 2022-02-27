 echo "local:"
 netstat -n | egrep ___usock___ | wc -l

 echo "from-remote:"
 netstat -n | egrep tcp | egrep ES | egrep 18890 | wc -l

