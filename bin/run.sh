#!/bin/sh

#Have the pod wait it's turn to start up (to space out logins)
sleep $NODE_WAIT

# Execute the command passed to the script
"$@"
