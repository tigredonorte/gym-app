#!/bin/bash

set -e

# Global variable to store the primary node
PRIMARY_NODE=""

check_env_variables() {
  echo "@@Checking env variables"
  if [[ 
    -z "${MONGO_USER}" || 
    -z "${MONGO_PASSWORD}" || 
    -z "${MONGO_DB}" || 
    -z "${MONGO_INITDB_ROOT_USERNAME}" || 
    -z "${MONGO_INITDB_ROOT_PASSWORD}" || 
    -z "${MONGO_ENABLE_REPLICA_SET}"
    ]]; then
    echo "@@Error: Required env variables: MONGO_USER, MONGO_PASSWORD, MONGO_DB, MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD."
    exit 1
  fi
}

set_permission_on_keyfile() {
  echo "@@Setting permissions on /data/keyfile..."
  chmod 600 /data/keyfile
  chown mongodb:mongodb /data/keyfile
}

start_mongo() {
  local auth=$1
  local hasReplicaSet=${MONGO_ENABLE_REPLICA_SET:-false}
  local allowExternalConnections=${MONGO_ALLOW_EXTERNAL_CONNECTIONS:-false}

  if _check_mongo_started "true"; then
    stop_mongo "true"
  elif _check_mongo_started "false"; then
    stop_mongo "false"
  fi

  echo "@@Starting MongoDB with auth={$auth}"
  if [[ "$auth" == "true" ]]; then
    mongod --auth --keyFile /data/keyfile --replSet rs0 --bind_ip_all --fork --port 27017 --logpath /var/log/mongodb/mongod.log
  else
    mongod --noauth --replSet rs0 --bind_ip_all --fork --port 27017 --logpath /var/log/mongodb/mongod.log
  fi

  _wait_mongo_start "$auth"
}

_wait_mongo_start() {
  local auth=$1
  echo "@@Waiting for MongoDB to start..."
  sleep 5
  attempt=0
  until check_mongo_started "$auth"; do
    attempt=$((attempt + 1))
    if [ $attempt -gt 10 ]; then
      echo "@@MongoDB failed to start. Exiting."
      exit 1
    fi
    echo "@@MongoDB is still starting, waiting..."
    sleep 5
  done
  echo "@@MongoDB started successfully."
}

check_mongo_started() {
  if _check_mongo_started "true"; then
    echo "@@Mongo started with authentication"
    return 0
  elif _check_mongo_started "false"; then
    echo "@@Mongo started without authentication"
    return 0
  else
    echo "@@Mongo not started"
    return 1
  fi
}

_check_mongo_started() {
  local auth=$1
  echo "@@Checking mongo status. Authenticated=($auth) "

  local authString=""
  if [[ "$auth" == "true" ]]; then
    authString="--username ${MONGO_INITDB_ROOT_USERNAME} --password ${MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin"
  fi
  
  status=$(mongosh --quiet --host localhost --port 27017 $authString --eval "db.adminCommand('ping').ok")

  echo "@@mongo status: $status"

  if [[ "$status" == "1" ]]; then
    return 0 # MongoDB started
  else
    return 1 # MongoDB not started yet
  fi
}

stop_mongo() {
  local auth=$1

  local authString=""
  if [[ "$auth" == "true" ]]; then
    echo "@@Stopping MongoDB to restart with authentication enabled..."
    authString="--username ${MONGO_INITDB_ROOT_USERNAME} --password ${MONGO_INITDB_ROOT_PASSWORD} --authenticationDatabase admin"
  else
    echo "@@Stopping MongoDB to restart without authentication..."
  fi

  status=$(timeout 10s mongosh $authString --eval "
    try {
      db.shutdownServer({force: true});
    } catch(e) {
      print(e);
      'error';
    }
  ")

  _wait_mongo_stop

  echo "@@MongoDB stop status: $status"
  if echo "$status" | grep -q "error"; then
    echo "@@Failed to stop MongoDB. Probably already stopped. Continuing..."
  fi

  if pgrep mongod > /dev/null; then
    echo "@@MongoDB is still running. Killing the process..."
    pkill -9 mongod
  fi
}

_wait_mongo_stop() {
  echo "@@Waiting for MongoDB to stop..."
  attempt=0
  while pgrep mongod > /dev/null; do
    attempt=$((attempt + 1))
    if [ $attempt -gt 10 ]; then
      echo "@@MongoDB failed to stop. Exiting."
      exit 1
    fi
    echo "@@MongoDB is still running, waiting..."
    sleep 5
  done
  echo "@@MongoDB stopped successfully."
}

create_root_user() {
  local username=$1
  local password=$2

  echo "@@Creating root user '$username'..."
   if ! mongosh --eval "
    use admin;
    if (db.getUser(\"${username}\") == null) {
      try {
        db.createUser({
          user: '${username}',
          pwd: '${password}',
          roles: [{ role: 'root', db: 'admin' }]
        });
        print('Root user created.');
      } catch(e) {
        print(e);
        'error';
      }
    } else {
      print('Root user already exists.');
    }
   "; then
    echo "@@Error: Failed to create root user '$username'. Exiting."
    exit 1
  else
    echo "@@Root user '$username' created successfully."
  fi
}

create_user() {
  local username=$1
  local password=$2
  local database=$3
  local role=$4

  echo "@@Verifying if user '$username' exists in database '$database'..."
  user_exists=$(_run_auth_mongosh "db.getUser('${username}') ? 'exists' : 'error'" "$database")
  if echo "$user_exists" | grep -q "exists"; then
    echo "@@User '$username' already exists in '$database'."
    return 0
  fi
  
  echo "@@User '$username' not found in '$database'. Attempting to create..."

  echo "@@Creating user '$username' with role '$role' in '$database'..."
  create_result=$(_run_auth_mongosh "
    db.createUser({
      user: '${username}',
      pwd: '${password}',
      roles: [{ role: '${role}', db: '${database}' }]
    });
  " "$database")
  
  echo "@@Create user result: $create_result"
  if echo "$create_result" | grep -q "error"; then
    echo "@@Failed to create user '$username'. Exiting."
    exit 1
  fi

  echo "@@Verifying user '$username' creation..."
  verify_result=$(_run_auth_mongosh "db.getUser('${username}') ? 'exists' : 'error'" "$database")

  if echo "$verify_result" | grep -q "exists"; then
    echo "@@User '$username' with role '$role' successfully created in '$database'."
  else
    echo "@@User '$username' not found after creation. Exiting."
    exit 1
  fi

  _connect_user "$username" "$password" "$database"
}

_run_auth_mongosh() {
  local eval_command=$1
  local database=$2

  # mongosh --quiet \
  #   --host "$PRIMARY_NODE" \
  #   --eval "$eval_command" \
  #   $database
  
  mongosh --quiet \
    --host "$PRIMARY_NODE" \
    --username "${MONGO_INITDB_ROOT_USERNAME}" \
    --password "${MONGO_INITDB_ROOT_PASSWORD}" \
    --authenticationDatabase "admin" \
    --eval "$eval_command" \
    $database
}

_connect_user() {
  local username=$1
  local password=$2
  local database=$3

  echo "@@Connecting as user '$username' to verify authentication..."
  connection_result=$(mongosh --username "$username" \
    --password "$password" \
    --authenticationDatabase "$database" \
    --eval "db.adminCommand('ping').ok" "$database")
  
  echo "@@Connection result: $connection_result"

  if echo "$connection_result" | grep -q "1"; then
    echo "@@Successfully connected as user '$username' to database '$database'."
  else
    echo "@@Failed to connect as user '$username'. Exiting."
    exit 1
  fi
}

start_replica_set() {

  if [[ "${MONGO_ENABLE_REPLICA_SET}" != "true" ]]; then
    echo "@@Replica set is not enabled. Skipping..."
    return 0
  fi

  local auth=$1
  echo "@@Starting replica set"
  if ! _check_replica_set_status "$auth"; then
    echo "@@Initializing replica set..."

    local status=""
    if [[ "$auth" == "true" ]]; then
      status=$(mongosh --username "${MONGO_INITDB_ROOT_USERNAME}" --password "${MONGO_INITDB_ROOT_PASSWORD}" --authenticationDatabase "admin" --eval "
        try {
          rs.initiate({
            _id: 'rs0',
            members: [
              { _id: 0, host: 'mongo1:27017', priority: 2 },
            ]
          })
        } catch(e) {
          print(e);
          'error';
        }
      ")
    else
      status=$(mongosh --eval "
        try {
          rs.initiate({
            _id: 'rs0',
            members: [
              { _id: 0, host: 'mongo1:27017', priority: 2 },
            ]
          })
        } catch(e) {
          print(e);
          'error';
        }
      ")
    fi
    
    echo "@@Replica set start status: $status"
    _wait_replica_set_start "$auth"
  else
    echo "@@Replica set already initialized."
  fi

  _set_primary_node
}

_check_replica_set_status() {
  local auth=$1
  echo "@@Checking replica set status. Auth $auth"
  if [[ "$auth" == "true" ]]; then
    status=$(mongosh --quiet --username "${MONGO_INITDB_ROOT_USERNAME}" --password "${MONGO_INITDB_ROOT_PASSWORD}" --authenticationDatabase "admin" --eval "
      try {
        rs.status().ok;
      } catch(e) {
        print(e);
        'error';
      }
    ")
  else
    status=$(mongosh --quiet --eval "
      try {
        rs.status().ok;
      } catch(e) {
        print(e);
        'error';
      }
    ")
  fi

  if echo "$status" | grep -q "not running with --replSet"; then
    echo "@@Error: mongo didn't start with --replSet. Exiting."
    exit 1
  fi

  echo "@@Replica set status: $status"

  if [[ "$status" == "1" ]]; then
    return 0
  else
    return 1
  fi
}

_wait_replica_set_start() {
  local auth=$1
  attempt=0
  echo "@@Waiting for replica set to initialize..."
  until _check_replica_set_status "$auth"; do
    attempt=$((attempt + 1))
    echo "@@Replica set is still initializing, waiting... Attempt $attempt"
    sleep 10
    if [ $attempt -gt 15 ]; then
      echo "@@Replica set initialization failed. Exiting."
      exit 1
    fi
  done
  echo "@@Replica set initialized successfully!"
}

_set_primary_node() {
  echo "@@Checking for primary node..."
  attempt=0
  primary_node=""

  while [ -z "$primary_node" ]; do
    primary_node=$(mongosh --quiet --username "${MONGO_INITDB_ROOT_USERNAME}" \
      --password "${MONGO_INITDB_ROOT_PASSWORD}" \
      --authenticationDatabase "admin" \
      --eval "const primary = rs.status().members.find(m => m.stateStr === 'PRIMARY'); primary ? primary.name : ''")

    if [ -z "$primary_node" ]; then
      attempt=$((attempt + 1))
      if [ $attempt -gt 10 ]; then
        echo "@@Failed to find primary node after multiple attempts. Exiting..."
        exit 1
      fi
      echo "@@No primary node found. Waiting for election... Attempt $attempt"
      sleep 5
    fi
  done

  echo "@@Primary node is: $primary_node"
  PRIMARY_NODE="$primary_node"
}