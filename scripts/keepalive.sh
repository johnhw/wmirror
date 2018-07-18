#!/bin/bash

# Keep chromium and the bottle server alive

cd /home/pi/wmirror/scripts
./launch.sh & 


while true
do
    sleep 15    
    # from: https://stackoverflow.com/questions/28337961/find-out-if-file-has-been-modified-within-the-last-2-minutes    
    FILE=/tmp/alive
    # How many seconds before file is deemed "older"
    OLDTIME=30
    # Get current and file times
    CURTIME=$(date +%s)
    FILETIME=$(stat $FILE -c %Y)
    TIMEDIFF=$(expr $CURTIME - $FILETIME)    

    # allow disabling of auto-relaunch by creating file /tmp/norelaunch
    if [ ! -f /tmp/norelaunch ]; then
        # Check if file older
        if [ ! -f /tmp/alive ] || [ $TIMEDIFF -gt $OLDTIME ]; then
            echo "Keep alive file is stale; forcing restart"
            # kill python and chromium
            killall -9 python
            killall -9 chromium
            sleep 5
            # make sure they are really dead
            killall -9 python
            killall -9 chromium
            sleep 1
            # relaunch
            ./launch.sh & 
        fi
    fi
done