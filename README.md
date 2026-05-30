# ToyCube — Панель управления персоналом Minecraft сервера

Полнофункциональная система управления персоналом, отслеживания действий модераторов,
сбора статистики и аналитики для Minecraft Java сервера.

## Стек технологий

**Frontend**
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- Recharts (графики)
- Тёмная тема, чёрный фон, оранжевые акценты, стеклянные панели

**Backend**
- NestJS
- PostgreSQL
- Prisma ORM
- Redis (кеш / сессии в будущем)
- JWT + RBAC (роли: MODERATOR, SENIOR_MODERATOR, ADMIN, OWNER)

**Инфраструктура**
- Docker + Docker Compose

## Возможности

- Система аккаунтов (логин/пароль, пароли хешируются bcrypt, JWT)
- 4 уровня доступа с проверкой полномочий на уровне роутов
- Автосоздание OWNER аккаунта `@efkalid` через seed
- Модалка «Привяжите Telegram» при первом входе (архитектура под будущий Telegram OAuth)
- Личный кабинет: профиль, статистика (Проверки / Муты / Наказания), валюта
- Статистика за день / неделю / месяц + графики + календарь активности
- Раздел «Состав» с поиском, фильтрацией, сортировкой
- Топы (проверки, муты, онлайн, наказания, активность)
- Мануалы (база знаний с Markdown, редактор для ADMIN/OWNER)
- Система логирования всех действий
- Архитектура под интеграцию с Minecraft (Velocity/BungeeCord/Spigot/Paper/Purpur) — пока Mock Data

## Быстрый старт (Docker)

```bash
cp .env.example .env
# при необходимости измените OWNER_PASSWORD и JWT_SECRET в .env

docker compose up --build
```

После сборки:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- PostgreSQL: localhost:5432
- Redis: localhost:6379

Миграции и seed применяются автоматически при старте backend-контейнера.

### Учётная запись владельца

| Поле   | Значение                          |
|--------|-----------------------------------|
| Логин  | `@efkalid`                        |
| Роль   | `OWNER`                           |
| Пароль | значение `OWNER_PASSWORD` из .env |

### Тестовые аккаунты (mock-сотрудники)

Seed создаёт несколько демо-сотрудников (h0up, Heldyy, MrPastaKing и др.)
с разными ролями. У всех них единый пароль для теста: `password`.
Логины совпадают с их никами с префиксом `@` (например `@heldyy`).
Эти аккаунты нужны только для демонстрации — удалите их в проде.

## Локальная разработка (без Docker)

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run start:dev

# Frontend (в отдельном терминале)
cd frontend
npm install
npm run dev
```

## Структура проекта

```
toycube/
├── backend/            # NestJS API
│   ├── prisma/         # schema.prisma + seed
│   └── src/
│       ├── auth/       # JWT, login, guards
│       ├── users/      # управление аккаунтами
│       ├── roles/      # RBAC, права
│       ├── stats/      # статистика и аналитика
│       ├── staff/      # состав сотрудников
│       ├── manuals/    # база знаний
│       ├── logs/       # логирование действий
│       ├── minecraft/  # интеграция (mock)
│       ├── telegram/   # заготовка под Telegram
│       └── common/     # guards, decorators, dto
├── frontend/           # Next.js 15
│   └── src/
│       ├── app/        # страницы (App Router)
│       ├── components/ # UI компоненты
│       └── lib/        # API клиент, утилиты
├── docker-compose.yml
└── .env.example
```

## Интеграция с Minecraft (на будущее)

Модуль `backend/src/minecraft` спроектирован как абстракция: интерфейс `MinecraftProvider`
имеет реализацию `MockMinecraftProvider`. Для реальной интеграции добавьте провайдера
(REST API плагина или RCON) и зарегистрируйте его в `MinecraftModule`. Поддерживаемые
платформы: Velocity, BungeeCord, Spigot, Paper, Purpur.

## Интеграция с Telegram (на будущее)

Эндпоинты `telegram/*` — заглушки. Архитектура готова к подключению Telegram OAuth
и Telegram Bot: добавьте проверку подписи `hash` от Telegram Login Widget в
`TelegramService.verifyAuth()`.
