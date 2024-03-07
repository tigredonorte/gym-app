#!/bin/bash

# Check if mongo-init.js already exists
if [[ -f mongo-init.js ]]; then
    echo "mongo-init.js already exists, skipping generation."
    exit 1  # Exit with non-zero status if mongo-init.js already exists
fi

source .env

# Generate random user and password if not set
if [[ -z $MONGO_USER ]]; then
    export MONGO_USER="user_$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13)"
fi

if [[ -z $MONGO_PASSWORD ]]; then
    export MONGO_PASSWORD="$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 13)"
fi

if [[ -z $MONGO_DB ]]; then
    export MONGO_DB="gym-app"
fi

echo "MONGO_USER=$MONGO_USER" >> .env
echo "MONGO_PASSWORD=$MONGO_PASSWORD" >> .env

cat <<EOL > mongo-init.js
db = db.getSiblingDB('$MONGO_DB');
db.createUser({
  user: "$MONGO_USER",
  pwd: "$MONGO_PASSWORD",
  roles: [{ role: "readWrite", db: "$MONGO_DB" }]
});
EOL