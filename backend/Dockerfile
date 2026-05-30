FROM node:20-alpine

# OpenSSL нужен Prisma для корректного движка на Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Ограничиваем память Node при сборке (Render Free = 512 МБ)
ENV NODE_OPTIONS=--max-old-space-size=460

# Установка зависимостей (включая dev — нужны prisma cli + ts-node для seed)
COPY package*.json ./
RUN npm install

# Prisma schema нужна до generate
COPY prisma ./prisma
RUN npx prisma generate

# Копируем исходники и собираем
COPY . .
RUN npm run build

EXPOSE 4000

# Создаём схему БД (db push — т.к. готовых миграций нет), заполняем БД
# (OWNER + mock), затем запускаем сервер. Render не использует docker-compose.
CMD sh -c "npx prisma db push --accept-data-loss && npm run seed && node dist/main.js"
