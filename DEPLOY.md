# 🚀 Деплой Frogface Studio

## 📋 Стратегия деплоя

### Компоненты системы:

1. **MCP-сервер** (Backend API)
   - Деплоить на: **Railway** / **Render** / **Fly.io** / **VPS**
   - Порт: 3001 (или через env)
   - Нужен доступ к файловой системе для knowledge/

2. **Web UI** (Next.js Frontend)
   - Деплоить на: **Vercel** ✅ (идеально для Next.js)
   - Статический деплой + API routes

3. **База знаний**
   - Временно: файловая система (knowledge/)
   - В будущем: **Firebase** / **Supabase** / **Pinecone**

## 🚀 Деплой на Vercel (Frontend)

### Вариант 1: Автоматический деплой через GitHub

1. **Создай репозиторий на GitHub:**
   ```bash
   git remote add origin https://github.com/yourusername/frogface-studio.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. **Подключи к Vercel:**
   - Зайди на https://vercel.com
   - "New Project" → выбери репозиторий
   - Root Directory: `apps/web`
   - Framework Preset: Next.js
   - Build Command: `cd ../.. && pnpm build --filter @frogface/web`
   - Install Command: `cd ../.. && pnpm install`

3. **Настрой Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-mcp-server.railway.app
   ```

### Вариант 2: Vercel CLI

```bash
cd apps/web
vercel
```

## 🔧 Деплой MCP-сервера

### Вариант 1: Railway (рекомендуется)

1. Создай аккаунт на https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Выбери репозиторий
4. Root Directory: `packages/core/mcp-server`
5. Build Command: `cd ../.. && pnpm install && pnpm --filter @frogface/core-mcp build`
6. Start Command: `cd packages/core/mcp-server && pnpm start`

**Environment Variables:**
```
OPENROUTER_API_KEY=your_key
MCP_PORT=3001
MCP_HOST=0.0.0.0
NODE_ENV=production
```

7. Railway даст тебе URL типа: `https://your-app.railway.app`

### Вариант 2: Render

1. Создай аккаунт на https://render.com
2. "New" → "Web Service"
3. Подключи GitHub репозиторий
4. Настройки:
   - Root Directory: `packages/core/mcp-server`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @frogface/core-mcp build`
   - Start Command: `cd packages/core/mcp-server && pnpm start`
   - Environment: Node

### Вариант 3: Fly.io

```bash
# Установи Fly CLI
curl -L https://fly.io/install.sh | sh

# Логин
fly auth login

# Создай приложение
cd packages/core/mcp-server
fly launch
```

## 🌐 Настройка CORS

MCP-сервер должен разрешать запросы с Vercel домена:

В `packages/core/mcp-server/src/server.ts` уже настроен CORS для всех источников. Для production можно ограничить:

```typescript
fastify.register(cors, {
  origin: [
    'https://your-app.vercel.app',
    'http://localhost:3000', // для dev
  ],
})
```

## 📁 База знаний в production

### Проблема: файловая система не персистентна

**Вариант 1: Использовать внешнее хранилище**

1. **Firebase Firestore:**
   - Персистентное
   - Масштабируемое
   - Бесплатный tier

2. **Supabase:**
   - PostgreSQL + Vector расширение
   - Отлично для RAG
   - Бесплатный tier

3. **Pinecone:**
   - Специализированное векторное хранилище
   - Идеально для embeddings
   - Бесплатный tier

**Вариант 2: Облачное хранилище**

- Сохранять `knowledge/` в **S3** / **Cloudflare R2**
- Синхронизировать при старте сервера

## 🔐 Environment Variables

### Frontend (Vercel):

```
NEXT_PUBLIC_API_URL=https://your-mcp-server.railway.app
```

### Backend (Railway/Render):

```
OPENROUTER_API_KEY=sk-or-v1-...
MCP_PORT=3001
MCP_HOST=0.0.0.0
NODE_ENV=production

# Опционально (для будущих интеграций)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
CANVA_API_KEY=
VK_ACCESS_TOKEN=
TELEGRAM_BOT_TOKEN=
```

## 📝 Чеклист деплоя

- [ ] Git репозиторий создан и код закоммичен
- [ ] Репозиторий на GitHub
- [ ] MCP-сервер задеплоен (Railway/Render/Fly.io)
- [ ] Получен URL MCP-сервера
- [ ] Web UI задеплоен на Vercel
- [ ] Environment variables настроены
- [ ] CORS настроен для production доменов
- [ ] Тестирование на production URL

## 🐛 Troubleshooting

### MCP-сервер не отвечает

- Проверь что порт правильный
- Проверь CORS настройки
- Проверь логи в Railway/Render

### Frontend не может подключиться

- Проверь `NEXT_PUBLIC_API_URL` в Vercel
- Проверь что MCP-сервер доступен публично
- Проверь CORS

### База знаний пустая

- Файловая система не персистентна в serverless
- Нужно использовать внешнее хранилище (Firebase/Supabase)

## 🎯 Следующие шаги

1. ✅ Создать Git репозиторий
2. ✅ Настроить Vercel для Frontend
3. ✅ Настроить Railway для Backend
4. 🔄 Мигрировать базу знаний на Firebase/Supabase
5. ✅ Протестировать на production

---

**После деплоя у тебя будет:**
- 🌐 Публичный URL для доступа к платформе
- 🔐 Безопасное хранение секретов
- 📈 Автоматические деплои при push в main
- 🚀 Production-ready платформа

