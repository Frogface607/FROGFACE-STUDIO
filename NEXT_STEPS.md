# 📋 Следующие шаги

## ✅ Что уже готово

- ✅ Полная архитектура платформы
- ✅ MCP-сервер с API
- ✅ Система агентов (копирайтер, архивариус)
- ✅ RAG система с автоматической загрузкой
- ✅ Web UI (Next.js)
- ✅ Git репозиторий
- ✅ Конфигурация для деплоя

## 🚀 Сейчас нужно сделать

### 1. Локальный запуск и тестирование

```bash
# Терминал 1
cd packages/core/mcp-server
pnpm dev

# Терминал 2  
cd apps/web
pnpm dev
```

Открой http://localhost:3000 и проверь что всё работает.

**См. [START_LOCAL.md](./START_LOCAL.md)**

### 2. Создать GitHub репозиторий

1. Зайди на https://github.com/new
2. Создай репозиторий `frogface-studio`
3. Подключи локальный репозиторий:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/frogface-studio.git
   git push -u origin main
   ```

**См. [SETUP_GIT.md](./SETUP_GIT.md)**

### 3. Деплой на Vercel (Frontend)

1. Зайди на https://vercel.com
2. "New Project" → выбери репозиторий
3. Настройки:
   - Root Directory: `apps/web`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @frogface/web build`
   - Install Command: `cd ../.. && pnpm install`
   - Framework: Next.js
4. Environment Variables:
   - `NEXT_PUBLIC_API_URL` = (получишь после деплоя бэкенда)

**См. [DEPLOY.md](./DEPLOY.md)**

### 4. Деплой на Railway (Backend)

1. Зайди на https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Выбери репозиторий
4. Настройки:
   - Root Directory: `packages/core/mcp-server`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @frogface/core-mcp build`
   - Start Command: `cd packages/core/mcp-server && pnpm start`
5. Environment Variables:
   - `OPENROUTER_API_KEY` = твой ключ
   - `MCP_PORT` = 3001
   - `MCP_HOST` = 0.0.0.0
   - `NODE_ENV` = production
6. Скопируй полученный URL (типа `https://xxx.railway.app`)

**См. [DEPLOY.md](./DEPLOY.md)**

### 5. Обнови URL в Vercel

После деплоя бэкенда, обнови в Vercel:
- `NEXT_PUBLIC_API_URL` = URL твоего Railway приложения

### 6. Проверь production

Открой URL от Vercel и проверь что всё работает.

## 🔄 После деплоя

### Миграция базы знаний

Сейчас база знаний хранится в файлах (`knowledge/`), что не работает в serverless.

**Варианты:**
1. **Firebase Firestore** (рекомендую)
2. **Supabase** (PostgreSQL + Vector)
3. **Pinecone** (векторное хранилище)

**См. [DEPLOY.md](./DEPLOY.md) - раздел "База знаний в production"**

### Добавить больше агентов

- Исследователь
- SMM менеджер
- Постер (с Canva API)
- Психолог
- Кросс-постер

### Интеграции

- Canva API
- VK API
- Telegram Bot API

### Голосовое управление

- Whisper API для speech-to-text
- ChatGPT для интерпретации команд

## 📚 Документация

- [START_LOCAL.md](./START_LOCAL.md) - Запуск локально
- [SETUP_GIT.md](./SETUP_GIT.md) - Настройка Git и GitHub
- [DEPLOY.md](./DEPLOY.md) - Инструкции по деплою
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура
- [KNOWLEDGE_GUIDE.md](./KNOWLEDGE_GUIDE.md) - Работа с RAG
- [ARCHIVIST_GUIDE.md](./ARCHIVIST_GUIDE.md) - Архивариус

---

**Порядок действий:**
1. ✅ Проверь локально
2. ✅ Создай GitHub репозиторий  
3. ✅ Деплой бэкенда (Railway)
4. ✅ Деплой фронтенда (Vercel)
5. ✅ Обнови URL в Vercel
6. ✅ Тестируй на production

**Удачи! 🚀**

