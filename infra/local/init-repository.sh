#!/bin/bash

source ./infra/local/scripts/docker.sh
source ./infra/local/scripts/doppler.sh
source ./infra/local/scripts/mongo.sh
source ./infra/local/scripts/nvm.sh
source ./infra/local/scripts/pnpm.sh

# Ensure .nvmrc is available
if [[ ! -f ".nvmrc" ]]; then
  echo ".nvmrc file not found!"
  exit 1
fi

installDocker
installDockerCompose
installDoppler

configureDoppler
installNVM
installPnpm

pnpm install

# Check if .env file exists
if [[ ! -f .env ]]; then
    # If not, copy .env.sample to .env
    cp .env.sample .env
fi

genMongoKeyFile

# Use Doppler to run Docker Compose
doppler run -- docker compose up --build -d
