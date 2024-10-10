#!/bin/bash

installDoppler() {
  # Install Doppler if not already installed
  if ! command -v doppler &> /dev/null
  then
      echo "Doppler not found! Installing..."
      curl -Ls https://cli.doppler.com/install.sh | sh
  else
      echo "Doppler is already installed!"
  fi

  # Verify Doppler installation
  doppler --version
}

dopplerLogin() {
  # Log in to Doppler if not already logged in
  if [[ -z $(doppler whoami) ]]; then
      echo "Logging in to Doppler..."
      doppler login
  else
      echo "Already logged in to Doppler!"
  fi
}

dopplerSetup() {
  # Check if Doppler project is already configured
  doppler_project=$(doppler configure get project --plain)
  doppler_config=$(doppler configure get config --plain)

  # If project or config is missing, run `doppler setup`
  if [[ -z "$doppler_project" || -z "$doppler_config" ]]; then
      echo "Doppler project or configuration is not set. Running doppler setup..."
      doppler setup
  else
      echo "Doppler project is already configured: $doppler_project (config: $doppler_config)"
  fi
}

configureDoppler() {

  dopplerLogin
  dopplerSetup
  
}