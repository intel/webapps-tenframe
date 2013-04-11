# script to reinstall wgt, stop/start it 10 times,
# then stop and start in debug to gather perf data
i=0

grunt reinstall

while [[ $i -lt 11 ]] ; do
  grunt restart
  sleep 5
  i=`calc $i+1`
done

grunt sdb:stop sdb:debug
