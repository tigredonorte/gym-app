#!/bin/bash

installNVM() {
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
}