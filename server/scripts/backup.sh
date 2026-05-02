#!/bin/bash
set -e

# Configuration
BACKUP_DIR="$(pwd)/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DB_CONTAINER="postgres-primary"
DB_USER="postgres"
DB_NAME="erp_db"

BACKUP_FILE="${BACKUP_DIR}/backup_${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "Starting backup of ${DB_NAME} from ${DB_CONTAINER}..."

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Execute pg_dump inside the primary container and compress it
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"

echo "Backup completed successfully: ${BACKUP_FILE}"

# Optional: keep only the last 7 backups to save space
# find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +7 -delete
