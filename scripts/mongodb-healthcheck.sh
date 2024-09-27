#!/bin/bash
set -eo pipefail

echo "Running MongoDB health check..."

# Attempt to get replica set status
replica_set_status=$(mongosh --quiet --eval "rs.status().ok" --port 27017 || echo "error")

if [[ "$replica_set_status" == "1" ]]; then
    echo "Replica set already initiated."
else
    echo "Replica set not initialized. Attempting to initiate replica set..."
    init_status=$(mongosh --quiet --eval "rs.initiate({_id:'rs0',members:[{_id:0,host:'mongo1:27017'}]})" --port 27017 || echo "error")

    if [[ "$init_status" == "error" ]]; then
        echo "Failed to initiate replica set."
        exit 1
    else
        echo "Replica set initiated successfully."
    fi
fi