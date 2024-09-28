#!/bin/bash
set -e

echo "@@------Healthcheck------"

source /docker-entrypoint-initdb.d/functions.sh  || { echo "Failed to source functions.sh"; exit 1; }

check_env_variables

auth="true"

_wait_mongo_start $auth

_wait_replica_set_start $auth

echo "@@------Healthcheck completed------"

exit 0
