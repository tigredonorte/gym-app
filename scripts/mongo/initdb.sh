#!/bin/bash
echo "@@------InitDb------"

set -e

source /functions.sh || { echo "@@------Failed to source functions.sh------"; exit 1; }

check_env_variables

auth="true"

start_mongo $auth

start_replica_set $auth

echo "@@------InitDb completed------"

exit 0
