#!/bin/bash
set -e

# If the data directory is empty, we need to do a base backup from the primary
if [ -z "$(ls -A "$PGDATA")" ]; then
    echo "Replica data directory is empty. Taking base backup from primary..."
    
    # Export password so pg_basebackup doesn't prompt
    export PGPASSWORD=$REPLICA_PASSWORD
    
    # Wait until primary is ready
    until pg_isready -h $PRIMARY_HOST -p 5432 -U $POSTGRES_USER; do
        echo "Waiting for primary to be ready..."
        sleep 2
    done
    
    # Run pg_basebackup
    pg_basebackup -h $PRIMARY_HOST -D "$PGDATA" -U $REPLICA_USER -vP -W
    
    # Write a standby.signal file to tell postgres to start in standby mode
    touch "$PGDATA/standby.signal"
    
    # Set primary connection info
    cat >> "$PGDATA/postgresql.auto.conf" <<EOF
primary_conninfo = 'host=$PRIMARY_HOST port=5432 user=$REPLICA_USER password=$REPLICA_PASSWORD'
EOF

    echo "Base backup completed."
    unset PGPASSWORD
fi

# Now start the regular postgres entrypoint
echo "Starting PostgreSQL in replica mode..."
exec docker-entrypoint.sh postgres
