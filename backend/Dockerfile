FROM php:8.2-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
    unzip zip curl libzip-dev libpq-dev git \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

COPY . .

RUN composer dump-autoload --optimize \
    && chmod +x /app/start.sh \
    && mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

ENV PORT=10000
EXPOSE 10000

CMD ["/app/start.sh"]
