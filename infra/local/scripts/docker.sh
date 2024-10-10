#!/bin/bash

installDocker() {
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
}

installDockerCompose() {
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
}