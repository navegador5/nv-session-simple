echo "from-chrome-and-edge"

netstat -n | egrep tcp | egrep ES | egrep 18890 | egrep 192.168.1.201 | wc -l

echo "from-andriods-and-android-simulators"
netstat -n | egrep tcp | egrep ES | egrep 18890 | egrep 192.168.1.200 | wc -l

echo "from-nodejs-client"
netstat -n | egrep tcp | egrep ES | egrep 18890 | egrep 192.168.1.105 | wc -l

