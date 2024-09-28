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
# Install Docker if not already installed
if ! command -v docker &> /dev/null
then
    echo "Docker not found! Installing Docker..."

    # Get OS and Machine Architecture
    os_name=$(uname -s | tr '[:upper:]' '[:lower:]')
    machine_arch=$(uname -m)

    if [ "$os_name" = "linux" ]; then
        # Install Docker Engine and Docker Compose Plugin for Linux

        # Update the apt package index and install packages to allow apt to use a repository over HTTPS
        sudo apt-get update

        sudo apt-get install -y \
            ca-certificates \
            curl \
            gnupg \
            lsb-release

        # Add Docker’s official GPG key
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
          sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

        # Use the following command to set up the repository
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
          https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) stable" | \
          sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

        # Update the apt package index
        sudo apt-get update

        # Install Docker Engine, CLI, containerd, and Docker Compose plugin
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    elif [ "$os_name" = "darwin" ]; then
        echo "Please install Docker Desktop for Mac from https://www.docker.com/products/docker-desktop"
        exit 1

    else
        echo "Unsupported OS: $os_name"
        exit 1
    fi

else
    echo "Docker is already installed!"
fi

# Check if 'docker compose' is available
if ! docker compose version &> /dev/null
then
    echo "'docker compose' is not available! Installing Docker Compose plugin..."

    # Install Docker Compose plugin
    # Ensure the directory exists
    sudo mkdir -p /usr/lib/docker/cli-plugins

    # Get the machine architecture
    machine_arch=$(uname -m)

    if [ "$machine_arch" = "x86_64" ]; then
        compose_arch="x86_64"
    elif [ "$machine_arch" = "aarch64" ] || [ "$machine_arch" = "arm64" ]; then
        compose_arch="aarch64"
    else
        echo "Unsupported architecture: $machine_arch"
        exit 1
    fi

    sudo curl -SL "https://github.com/docker/compose/releases/download/v2.22.0/docker-compose-linux-$compose_arch" -o /usr/lib/docker/cli-plugins/docker-compose

    sudo chmod +x /usr/lib/docker/cli-plugins/docker-compose

else
    echo "'docker compose' is already installed!"
fi

# Verify the installation
docker compose version

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

# Check if .env file exists
if [[ ! -f .env ]]; then
    # If not, copy .env.sample to .env
    cp .env.sample .env
fi

# Check if .env file exists
if [[ ! -f mongo-keyfile ]]; then

    if ! command -v openssl &> /dev/null
    then
        echo "openssl not found! Installing..."
        npm install -g openssl
    else
        echo "openssl is already installed!"
    fi

    openssl rand -base64 756 > ./scripts/mongo/mongo-keyfile
    chmod 600 ./scripts/mongo/mongo-keyfile
fi

docker compose up --build
