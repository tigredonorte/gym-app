#!/bin/bash
set -e

IMPORT_DIR="/opt/keycloak/data/import"

echo "--- [DEBUG] Entrypoint script started."

# Start Keycloak in the background
/opt/keycloak/bin/kc.sh start &
KC_PID=$!

# Dependency-free health check
echo "--- [DEBUG] Waiting for Keycloak to open port 8080..."
TRIES=0
MAX_TRIES=60
while ! (exec 3<>/dev/tcp/localhost/8080) 2>/dev/null; do
    TRIES=$((TRIES + 1))
    if [ $TRIES -gt $MAX_TRIES ]; then
        echo "--- [ERROR] Keycloak did not become available after $MAX_TRIES attempts."
        exit 1
    fi
    echo "--- [DEBUG] Still waiting for Keycloak port... (Attempt $TRIES/$MAX_TRIES)"
    sleep 2
done
exec 3>&-
echo "--- [DEBUG] Keycloak port is open. Proceeding."

# Authenticate with the Admin CLI
echo "--- [DEBUG] Authenticating admin user with kcadm.sh..."
/opt/keycloak/bin/kcadm.sh config credentials --server http://localhost:8080 --realm master --user $KEYCLOAK_ADMIN --password $KEYCLOAK_ADMIN_PASSWORD

# Loop through all JSON files in the import directory
for REALM_FILE_PATH in $IMPORT_DIR/*.json; do
  if [ -f "$REALM_FILE_PATH" ]; then
    echo "----------------------------------------------------"
    echo "--- [INFO] Processing realm file: $REALM_FILE_PATH"
    REALM_NAME=$(grep '"realm":' "$REALM_FILE_PATH" | head -n 1 | cut -d '"' -f 4)

    if [ -z "$REALM_NAME" ]; then
        echo "--- [WARNING] Could not extract realm name. Skipping."
        continue
    fi

    # --- START: CREATE OR UPDATE LOGIC ---
    echo "--- [INFO] Found realm name '$REALM_NAME'. Checking if it exists..."
    
    # Try to get the realm. Redirect output to /dev/null, we only care about the exit code.
    if /opt/keycloak/bin/kcadm.sh get realms/$REALM_NAME > /dev/null 2>&1; then
        # If the command succeeds (exit code 0), the realm exists.
        echo "--- [INFO] Realm '$REALM_NAME' exists. Updating..."
        /opt/keycloak/bin/kcadm.sh update realms/$REALM_NAME -f "$REALM_FILE_PATH"
    else
        # If the command fails, the realm does not exist.
        echo "--- [INFO] Realm '$REALM_NAME' does not exist. Creating..."
        /opt/keycloak/bin/kcadm.sh create realms -f "$REALM_FILE_PATH"
    fi
    # --- END: CREATE OR UPDATE LOGIC ---
  fi
done

echo "----------------------------------------------------"
echo "--- [INFO] All realm configurations processed. Tailing logs..."
wait $KC_PID