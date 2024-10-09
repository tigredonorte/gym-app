#!/bin/bash

genMongoKeyFile() {
  # Check if the Mongo keyfile exists
  if [[ ! -f ./scripts/mongo/mongo-keyfile ]]; then
      if ! command -v openssl &> /dev/null
      then
          echo "openssl not found! Installing..."
          # sudo apt-get install -y openssl
          npm install -g openssl
      else
          echo "openssl is already installed!"
      fi

      openssl rand -base64 756 > ./scripts/mongo/mongo-keyfile
      chmod 600 ./scripts/mongo/mongo-keyfile
      echo "Mongo keyfile generated!"
  else
      echo "Mongo keyfile already exists!"
  fi
}