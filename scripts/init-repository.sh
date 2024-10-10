#!/bin/bash

source ./scripts/setup/docker.sh
source ./scripts/setup/doppler.sh
source ./scripts/setup/mongo.sh
source ./scripts/setup/nvm.sh
source ./scripts/setup/pnpm.sh
source ./scripts/setup/kompose.sh
source ./scripts/setup/kubernetes.sh

# Ensure .nvmrc is available
if [[ ! -f ".nvmrc" ]]; then
  echo ".nvmrc file not found!"
  exit 1
fi

installDocker
installDockerCompose
installDoppler
installKubernetes
installKompose
installNVM
installPnpm

# Check if .env file exists
if [[ ! -f .env ]]; then
    # If not, copy .env.sample to .env
    cp .env.sample .env
fi

configureDoppler

pnpm install

genMongoKeyFile

pnpm dev -d