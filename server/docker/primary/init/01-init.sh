#!/bin/bash
set -e

# Create the replica user
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER $REPLICA_USER WITH REPLICATION ENCRYPTED PASSWORD '$REPLICA_PASSWORD';
EOSQL

# Add replication privileges to pg_hba.conf
echo "host replication $REPLICA_USER 0.0.0.0/0 md5" >> "$PGDATA/pg_hba.conf"

# The command arguments from docker-compose.yml will override postgresql.conf, 
# so we don't need to manually update postgresql.conf here.
