FROM php:8.2-cli

WORKDIR /app

RUN apt-get update && apt-get install -y \
        unzip zip curl git \
        libzip-dev libpq-dev \
        libpng-dev libjpeg-dev libfreetype6-dev libwebp-dev \
        libonig-dev libxml2-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) \
        pdo pdo_mysql pdo_pgsql zip gd bcmath mbstring \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts \
    && chmod +x /app/start.sh \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

ENV PORT=10000
EXPOSE 10000

CMD ["/app/start.sh"]
