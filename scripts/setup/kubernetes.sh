#!/bin/bash

# Function to create MongoDB secrets
createSecrets() {
  if kubectl get secret mongo-secret &> /dev/null; then
    echo "Secret mongo-secret already exists"
  else
    echo "Creating mongo-secret"
    export $(grep -v '^#' .env | xargs)
    kubectl create secret generic mongo-secret \
      --from-literal=mongo-root-username=$MONGO_INITDB_ROOT_USERNAME \
      --from-literal=mongo-root-password=$MONGO_INITDB_ROOT_PASSWORD
  fi
}

installKubernetes() {
  # Install kubectl if not already installed
  if ! command -v kubectl &> /dev/null
  then
    echo "kubectl not found! Installing..."
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    if [[ -f ./kubectl ]]; then
        chmod +x ./kubectl
        sudo mv ./kubectl /usr/local/bin/kubectl
        echo "kubectl installed successfully!"
    else
        echo "Failed to download kubectl."
        exit 1
    fi
  else
      echo "kubectl is already installed!"
  fi

  kubectl version --client
}
