# 🔄 ПЕРЕСОЗДАНИЕ ПРОЕКТА НА RAILWAY

## ✅ Что нужно сделать

### ШАГ 1: Удалить текущий проект в Railway

1. Зайди в **Railway Dashboard**
2. Выбери проект `FROGFACE-STUDIO` (или как он называется)
3. Нажми **Settings** (шестерёнка)
4. Прокрути вниз до **"Danger Zone"** или **"Delete"**
5. Удали проект

**ИЛИ** если не хочешь удалять:
- Можешь просто создать новый сервис в том же проекте

---

### ШАГ 2: Создать новый проект/сервис

1. В Railway Dashboard нажми **"New Project"**
2. Выбери **"Deploy from GitHub repo"**
3. Выбери репозиторий: `Frogface607/FROGFACE-STUDIO`
4. Выбери ветку: `main`

---

### ШАГ 3: Настроить переменные окружения

После создания проекта перейди в **Variables** и добавь:

```
OPENROUTER_API_KEY=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
SUPABASE_URL=https://ydpcfolffvatbweiuekn.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcGNmb2xmZnZhdGJ3ZWl1ZWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYzODE5OCwiZXhwIjoyMDc3MjE0MTk4fQ.Z6S4C6eOcRsb-6cTpId11PtpuNz_-0jzYVK1qt2rN4g
MCP_PORT=3001
PORT=3001
```

---

### ШАГ 4: Настроить деплой

Railway автоматически использует `railway.toml` из репозитория!

**Но если нужно вручную:**

1. **Settings** → **Deploy**
2. **Root Directory** - оставь ПУСТЫМ
3. **Build Command** - оставь пустым (Railway использует из `railway.toml`)
4. **Start Command** - оставь пустым (Railway использует из `railway.toml`)

**Или если хочешь явно указать:**

**Start Command:**
```
cd packages/core/mcp-server && pnpm exec tsx src/server.ts
```

---

### ШАГ 5: Деплой

1. Railway автоматически начнет деплой
2. Или нажми **"Deploy"** вручную
3. Подожди пока установятся зависимости и запустится сервер

---

## 🔍 Проверка

После деплоя проверь логи - должно быть:

```
✅ Installing dependencies...
✅ Starting server with tsx...
✅ Server listening on port 3001
```

---

## 📋 Текущая конфигурация (уже в репозитории)

`railway.toml`:
```toml
[build]
builder = "NIXPACKS"
buildCommand = "pnpm install"

[deploy]
startCommand = "cd packages/core/mcp-server && pnpm exec tsx src/server.ts"
```

`package.json` (mcp-server):
- `tsx` в `dependencies` ✅
- Все зависимости установлены ✅

---

## 💡 Преимущества пересоздания

- ✅ Чистые настройки без кэша
- ✅ Railway подхватит актуальный `railway.toml`
- ✅ Все переменные окружения будут свежие
- ✅ Гарантированно использовать последний код

---

**После пересоздания должно заработать!** 🚀

