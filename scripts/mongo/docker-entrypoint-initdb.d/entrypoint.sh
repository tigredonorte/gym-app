#!/bin/bash
set -e
source /docker-entrypoint-initdb.d/functions.sh  || { echo "Failed to source functions.sh"; exit 1; }

echo -e "\n\n@@------Initializing database------\n\n"

check_env_variables

# set_permission_on_keyfile

create_root_user "${MONGO_INITDB_ROOT_USERNAME}" "${MONGO_INITDB_ROOT_PASSWORD}"

auth="true"

start_mongo $auth

start_replica_set $auth

create_user "${MONGO_USER}" "${MONGO_PASSWORD}" "${MONGO_DB}" "readWrite"

echo -e "\n\n@@------Database init completed.------\n\n"
