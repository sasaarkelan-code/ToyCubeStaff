FROM node:20-alpine

WORKDIR /app

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

# Команда запуска переопределяется в docker-compose (migrate + seed + start)
CMD ["node", "dist/main.js"]
