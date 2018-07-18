# these should be in RAM disk, but just to be sure
rm /tmp/norelaunch
rm /tmp/alive

# begin the keepalive script
cd /home/pi/wmirror/scripts
mon ./keepalive.sh

