#!/bin/sh
file_path='/home/ec2-user/minecraft/logs/latest.log'

uptime_sec=$(cat /proc/uptime | awk '{print $1}' | awk '{printf("%d\n",$1)}')
if [ $(( uptime_sec )) -gt 900 ]; then
    nowstarting=false
else
    nowstarting=true
fi

in_cnt=$(grep -o 'joined the game' $file_path | grep -c 'joined the game')
out_cnt=$(grep -o 'left the game' $file_path | grep -c 'left the game')

if $nowstarting; then
    echo 'now starting the server'
elif [ $(( in_cnt )) -gt $(( out_cnt )) ]; then
    echo 'someone is login'
else
    sudo shutdown
fi
