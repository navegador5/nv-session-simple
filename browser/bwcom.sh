esbuild  index.js --bundle  --minify --global-name=Bwsess --external:util --target=chrome90 > browser.js

#esbuild  index.js --bundle  --global-name=Bwsess --external:util --target=chrome90 > browser.js



#esbuild  index.js --bundle   --global-name=Bwsess --external:util --target=chrome90 > browser.js
#uglifyjs browser.js -m -c -o ../browser.js
#rm browser.js
#cp index.js ../index.js

