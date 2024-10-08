#!/bin/bash

installKompose() {
  # Install Kompose if not already installed
  if ! command -v kompose &> /dev/null
  then
      echo "Kompose not found! Installing..."
      curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-linux-amd64 -o kompose
      chmod +x kompose
      sudo mv kompose /usr/local/bin/kompose
  else
      echo "Kompose is already installed!"
  fi
  kompose version
}

