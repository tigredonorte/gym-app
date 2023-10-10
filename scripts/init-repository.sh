#!/bin/bash

# init_script.sh

# Ensure script is run as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Ensure .nvmrc is available
if [[ ! -f ".nvmrc" ]]; then
  echo ".nvmrc file not found!"
  exit 1
fi

# Install Docker if not already installed
if ! command -v docker-compose &> /dev/null
then
    # Get OS and Machine Architecture, convert to lowercase
    os_name=$(uname -s | tr '[:upper:]' '[:lower:]')
    machine_arch=$(uname -m | tr '[:upper:]' '[:lower:]')

    echo "docker-compose not found! Downloading..."
    # Download docker-compose and set permissions
    curl -L "https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-$os_name-$machine_arch" -o /usr/local/bin/docker-compose

    # Apply executable permissions to the binary
    chmod +x /usr/local/bin/docker-compose
else
    echo "docker-compose is already installed!"
fi
docker-compose --version

# Install NVM (Node Version Manager)
if ! command -v nvm &> /dev/null
then
    echo "NVM not found! Installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
else
    echo "NVM is already installed!"
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

nvm install
nvm use

# Check for and install pnpm
if ! command -v pnpm &> /dev/null
then
    echo "pnpm not found! Installing..."
    npm install -g pnpm
else
    echo "pnpm is already installed!"
fi

pnpm install

docker-compose build
docker ps