#!/usr/bin/env bash
set -e

php artisan config:clear || true
php artisan route:clear || true

php artisan migrate --force
php artisan db:seed --force || echo "Seeder skipped or failed (non-fatal)."

php artisan config:cache
php artisan route:cache

exec php artisan serve --host=0.0.0.0 --port="${PORT:-10000}"
