#!/bin/sh
set -e

echo "Running database migrations..."
bunx prisma migrate deploy
echo "Migrations complete."

exec "$@"
