#!/bin/bash

##
# Update a running wmirror install
##

# Check if there is a version on github newer than what we have downloaded

# Fetch the latest version of the software from github
cd ~/wmirror/releases
curl -s https://api.github.com/repos/johnhw/wmirror/releases/latest \
| grep "zipball_url" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -

# Create new version directory
latest_release = ~/wmirror/releases/$latest
unzip latest_release

# Set the "test" version to this version
rm ~/wmirror/releases/test
ln -s ~/wmirror/releases/test $latest_release_dir
set WMIRROR_RELEASE=test

# Shutdown the server
killall -9 python
killall -9 chromium
rm /tmp/alive

# Wait for server to restart
sleep 60

# If server starts up correctly
# set this version to be the "active version"
FILE=/tmp/alive
# How many seconds before file is deemed "older"
OLDTIME=30
# Get current and file times
CURTIME=$(date +%s)
FILETIME=$(stat $FILE -c %Y)
TIMEDIFF=$(expr $CURTIME - $FILETIME)    
  
# Check if file present and is newer than 30 seconds ago 
if [ -f /tmp/alive ] && [ $TIMEDIFF -lt $OLDTIME ]; then
    rm ~/wmirror/releases/active
    ln -s ~/wmirror/releases/active $latest_release_dir
    set WMIRROR_RELEASE=active
else
    # force restart, using the active script
    set WMIRROR_RELEASE=active    
    killall -9 python
    killall -9 chromium
    rm /tmp/alive
fi

