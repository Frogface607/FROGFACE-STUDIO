# 🚀 План деплоя в облако

## ✅ Цель: Полностью облачное решение

- ❌ Не париться с локальными терминалами
- ✅ Все работает в облаке
- ✅ База данных персистентна (Supabase)
- ✅ Backend на Railway
- ✅ Frontend на Vercel
- ✅ ChatGPT через MCP

## 📋 Выбор технологий

### База данных: **Supabase** ✅

**Почему Supabase:**
- PostgreSQL (надежный, знакомый)
- Встроенная поддержка vector (pgvector) для RAG
- Бесплатный tier (500MB БД, достаточный для начала)
- Realtime subscriptions (для будущего)
- Автоматические REST API
- Простая интеграция

**Альтернативы:**
- Firebase Firestore (NoSQL, но без vector)
- MongoDB Atlas (если нужен NoSQL)
- PostgreSQL на Railway (без vector из коробки)

### Backend: **Railway** ✅

**Почему Railway:**
- Простой деплой из GitHub
- Автоматический HTTPS
- Environment variables
- Логи в реальном времени
- Бесплатный tier (500 часов/месяц)
- Простая настройка домена

**Альтернатива:** Render (похожий, тоже хорош)

### Frontend: **Vercel** ✅

**Почему Vercel:**
- Идеально для Next.js
- Автоматический деплой из GitHub
- Edge network (быстро по всему миру)
- Бесплатный tier щедрый
- Простая настройка

## 🏗️ Архитектура

```
┌─────────────────┐
│   ChatGPT UI    │ ← Голосовое управление
└────────┬────────┘
         │ MCP stdio
         ↓
┌─────────────────┐
│  MCP Server     │ ← Railway
│  (Fastify)      │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐      ┌──────────────┐
│  Next.js Web UI │ ←──→ │   Supabase   │
│  (Vercel)       │      │  PostgreSQL  │
└─────────────────┘      └──────────────┘
                                ↑
                                │
                         ┌──────┴──────┐
                         │  RAG Store  │
                         │  Embeddings │
                         └─────────────┘
```

## 🔄 План миграции

### Этап 1: Supabase настройка ⏳

1. ✅ Создать проект на Supabase
2. ✅ Создать таблицы для базы знаний
3. ✅ Включить расширение pgvector
4. ✅ Создать функции поиска

### Этап 2: Миграция knowledge-base ⏳

1. ✅ Создать адаптер Supabase
2. ✅ Обновить `knowledge-base` для использования Supabase
3. ✅ Сохранить обратную совместимость (fallback на in-memory)

### Этап 3: Деплой Backend ⏳

1. ✅ Создать Railway проект
2. ✅ Настроить GitHub integration
3. ✅ Настроить environment variables
4. ✅ Деплой MCP-server

### Этап 4: Деплой Frontend ⏳

1. ✅ Создать Vercel проект
2. ✅ Настроить GitHub integration
3. ✅ Настроить environment variables
4. ✅ Деплой Next.js app

### Этап 5: ChatGPT интеграция ⏳

1. ✅ Настроить MCP stdio endpoint
2. ✅ Подключить ChatGPT Desktop App
3. ✅ Протестировать голосовое управление

## 📦 Структура БД (Supabase)

### Таблица: `knowledge_items`

```sql
CREATE TABLE knowledge_items (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  namespace TEXT NOT NULL,
  embedding vector(1536), -- OpenAI embeddings размер
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Индексы
  INDEX idx_namespace (namespace),
  INDEX idx_embedding USING ivfflat (embedding vector_cosine_ops)
);
```

### Функции поиска

```sql
-- Поиск по similarity (vector search)
CREATE FUNCTION search_knowledge(
  query_embedding vector(1536),
  target_namespace TEXT,
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id TEXT,
  content TEXT,
  similarity FLOAT,
  metadata JSONB
)
```

## 🔐 Environment Variables

### Railway (Backend)

```env
# API Keys
OPENROUTER_API_KEY=sk-or-v1-...
NODE_ENV=production

# Server
MCP_PORT=3001
MCP_HOST=0.0.0.0

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=xxx
SUPABASE_ANON_KEY=xxx

# Optional
CANVA_API_KEY=xxx
VK_ACCESS_TOKEN=xxx
TELEGRAM_BOT_TOKEN=xxx
```

### Vercel (Frontend)

```env
NEXT_PUBLIC_API_URL=https://your-app.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### ChatGPT MCP Config

```json
{
  "mcpServers": {
    "frogface-studio": {
      "command": "curl",
      "args": [
        "-N",
        "-H", "Content-Type: application/json",
        "https://your-app.railway.app/mcp/stdio"
      ]
    }
  }
}
```

## ✅ Преимущества облачного решения

1. **Не нужно запускать локально** - все работает в браузере
2. **Персистентная база данных** - знания не теряются
3. **Доступ везде** - используй с любого устройства
4. **Автоматические деплои** - push в GitHub = деплой
5. **Масштабируемость** - легко расширять
6. **Безопасность** - Railway/Vercel/Supabase занимаются безопасностью

## 🎯 Что делать дальше

1. **Сейчас:** Создаю адаптер Supabase для базы знаний
2. **Потом:** Покажу как развернуть все на Railway/Vercel
3. **Затем:** Подключим ChatGPT через MCP
4. **И дальше:** Ты разрабатываешь агентов, я помогаю деплоить

---

**Готов начинать миграцию?** 🚀

