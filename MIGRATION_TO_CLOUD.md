# ☁️ Миграция в облако - пошаговый план

## 🎯 Цель

Развернуть всю систему в облаке, чтобы:
- ✅ Не париться с локальными терминалами
- ✅ Все данные персистентны
- ✅ Доступ откуда угодно
- ✅ Автоматические деплои

## 📋 План действий

### Этап 1: Supabase (База данных) 🟢

**Время: 10-15 минут**

1. ✅ Создать проект на https://supabase.com
2. ✅ Включить расширение pgvector
3. ✅ Создать таблицу `knowledge_items` (SQL из `SUPABASE_SETUP.md`)
4. ✅ Получить API ключи
5. ✅ Добавить в `.env.local`:
   ```env
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_KEY=xxx
   ```

**Файлы:** `SUPABASE_SETUP.md` содержит всю SQL

---

### Этап 2: Обновить knowledge-base 🟡

**Время: 5 минут**

1. ✅ Адаптер Supabase создан (`packages/core/knowledge-base/src/supabase-adapter.ts`)
2. ⏳ Обновить `index.ts` для использования Supabase (с fallback на in-memory)
3. ⏳ Протестировать локально с Supabase

**Результат:** База знаний работает с Supabase, но может работать и без него (fallback)

---

### Этап 3: Деплой Backend (Railway) 🟡

**Время: 10 минут**

1. ⏳ Создать аккаунт на https://railway.app
2. ⏳ "New Project" → "Deploy from GitHub repo"
3. ⏳ Выбрать репозиторий
4. ⏳ Настроить:
   - Root Directory: `packages/core/mcp-server`
   - Build Command: `cd ../.. && pnpm install && pnpm --filter @frogface/core-mcp build`
   - Start Command: `cd packages/core/mcp-server && pnpm start`
5. ⏳ Добавить Environment Variables (см. `DEPLOY_PLAN.md`)
6. ⏳ Railway даст URL типа: `https://your-app.railway.app`

**Результат:** Backend работает в облаке, доступен по URL

---

### Этап 4: Деплой Frontend (Vercel) 🟡

**Время: 5 минут**

1. ⏳ Создать аккаунт на https://vercel.com
2. ⏳ "New Project" → Import GitHub repo
3. ⏳ Настроить:
   - Root Directory: `apps/web`
   - Framework: Next.js
   - Build Command: `cd ../.. && pnpm build --filter @frogface/web`
4. ⏳ Добавить Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-app.railway.app
   ```
5. ⏳ Deploy!

**Результат:** Frontend работает на Vercel, доступен по URL

---

### Этап 5: Подключить ChatGPT 🟡

**Время: 5 минут**

1. ⏳ Установить ChatGPT Desktop App (если еще нет)
2. ⏳ Настроить MCP config:
   ```json
   {
     "mcpServers": {
       "frogface-studio": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-everything"
         ],
         "env": {
           "MCP_SERVER_URL": "https://your-app.railway.app/mcp/stdio"
         }
       }
     }
   }
   ```
3. ⏳ Перезапустить ChatGPT
4. ⏳ Протестировать голосовое управление

**Результат:** Можешь управлять агентами голосом через ChatGPT

---

## ✅ Чеклист готовности

**Перед миграцией:**

- [ ] Git репозиторий создан и код закоммичен
- [ ] Репозиторий на GitHub
- [ ] `.env.local` работает локально

**После миграции:**

- [ ] Supabase настроен и работает
- [ ] Railway деплой успешен
- [ ] Vercel деплой успешен
- [ ] Frontend подключается к Backend
- [ ] База знаний сохраняет данные
- [ ] ChatGPT подключен к MCP

## 🔄 Миграция данных

Если у тебя уже есть данные в `knowledge-store.json`:

1. Экспортируй из локального хранилища:
   ```bash
   pnpm tsx scripts/export-knowledge.ts
   ```

2. Импортируй в Supabase:
   ```bash
   pnpm tsx scripts/import-to-supabase.ts
   ```

(Создам эти скрипты когда понадобится)

## 🎯 После миграции

**Ты сможешь:**
- ✅ Открыть Web UI в браузере (Vercel URL)
- ✅ Использовать через UI (никаких терминалов!)
- ✅ Управлять голосом через ChatGPT
- ✅ Все данные персистентны в Supabase
- ✅ Разрабатывать агентов локально, деплоить автоматически

**Я буду:**
- ✅ Помогать создавать агентов
- ✅ Загружать файлы в базу через меня
- ✅ Дорабатывать архивариуса
- ✅ Деплоить изменения

---

## ⚡ Быстрый старт миграции

Хочешь начать прямо сейчас?

1. **Я создам SQL для Supabase** ✅ (готово в `SUPABASE_SETUP.md`)
2. **Ты создашь проект Supabase** и выполнишь SQL
3. **Я обновлю knowledge-base** для работы с Supabase
4. **Потом деплоим** на Railway/Vercel

**Готов начинать?** 🚀

