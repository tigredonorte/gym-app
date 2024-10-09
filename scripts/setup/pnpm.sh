#!/bin/bash

installPnpm() {
  # Check for and install pnpm
  if ! command -v pnpm &> /dev/null
  then
      echo "pnpm not found! Installing..."
      npm install -g pnpm
  else
      echo "pnpm is already installed!"
  fi
}