#!/bin/bash
set -eo pipefail

# Attempt to get replica set status
if mongosh --quiet --eval "rs.status();" --port 27017; then
    echo "Replica set already initiated."
else
    echo "Initiating replica set..."
    mongosh --quiet --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'host.docker.internal:27017'}]});" --port 27017
fi