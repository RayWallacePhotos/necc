#!/bin/bash
#
#      run.sh
#
#    npm install -g lite-server
#      ---OR---
#    npm install -g light-server
# I prefer lite-server 
#
# Need to do:
#   chmod +x ./run.sh
# --or-- User to Readable & eXecutable
#   chmod u+rx ./run.sh


#  Need path or we get "Command Not Found" error
#  Alternatively could run:  npx lite-server
~/.npm-packages/bin/lite-server


#  Need path or we get "Command Not Found" error
#light-server --no-reload --open --serve .
#~/.npm-packages/bin/light-server --no-reload --open --serve .


# Give time to read sh errors
sleep 60s

