#!/bin/bash

echo -e "\n\n@@Healthcheck\n\n"

set -e
source ./functions.sh || { echo "Failed to source functions.sh"; exit 1; }

check_env_variables

