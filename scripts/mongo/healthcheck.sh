#!/bin/bash

echo "@@------Healthcheck------"

set -e
source /functions.sh || { echo "@@------Failed to source functions.sh------"; exit 1; }

check_env_variables

auth="true"

check_mongo_started $auth

if ! _check_replica_set_status $auth; then
  echo "@@Replica set is not initialized"
  stop_mongo $auth
  start_mongo $auth
  start_replica_set $auth
fi

if ! _check_replica_set_status $auth; then
  echo "@@-----Failed to initialize replica set. Exiting.------"
  exit 1
fi

echo "@@------Healthcheck completed------"

exit 0
