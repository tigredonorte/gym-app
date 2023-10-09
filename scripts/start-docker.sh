#!/bin/bash

if ! command -v docker &> /dev/null
then
    echo "Docker is not installed. Please install it to proceed."
    exit 1
fi

if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose is not installed. Please install it to proceed."
    exit 1
fi

echo "Building and starting Docker containers..."
docker-compose up --build
