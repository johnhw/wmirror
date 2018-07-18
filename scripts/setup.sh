#!/bin/bash

###
# Set up a new, fresh RPi install for wmirror mode
###

# Update apt-get
sudo apt-get update

# Install required packages
sudo apt-get install devel-essential python3 chromium

# set up python packages
pip install -r requirements.txt

# set up mon, to keep the keepalive script ticking over
(mkdir /tmp/mon && cd /tmp/mon && curl -L# https://github.com/tj/mon/archive/master.tar.gz | tar zx --strip 1 && make install && rm -rf /tmp/mon)

# Fetch the latest version of the software from github
cd ~/wmirror/releases
curl -s https://api.github.com/repos/johnhw/wmirror/releases/latest \
| grep "zipball_url" \
| cut -d : -f 2,3 \
| tr -d \" \
| wget -qi -

# find latest zip file
# unzip it...
unset -v latest
for file in "~/wmirror/releases"/*zip; do
  [[ $file -nt $latest ]] && latest=$file
done

latest_release = ~/wmirror/releases/$latest
unzip latest_release

# find dir corresponding to the unzipped file, and link it 
# to all of the releases (since this is a fresh install)

rm ~/wmirror/releases/fallback
rm ~/wmirror/releases/active
rm ~/wmirror/releases/test

ln -s ~/wmirror/releases/fallback $latest_release_dir
ln -s ~/wmirror/releases/active $latest_release_dir
ln -s ~/wmirror/releases/test $latest_release_dir

# Configure watchdog

# Configure kiosk mode

# Configure ntp

# Configure logging

# Configure wifi 

# Set keep alive script to run on boot

# Configure sd card for RO mode (must be done last!)

# Restart!