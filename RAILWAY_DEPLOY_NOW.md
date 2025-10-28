# 🚂 ДЕПЛОЙ НА RAILWAY (Сейчас!)

## ✅ Репозиторий уже на GitHub!

**URL:** https://github.com/Frogface607/FROGFACE-STUDIO

## 🚀 Деплой на Railway (5 минут)

### Шаг 1: Зайти на Railway

1. Открой https://railway.app
2. **"Start a New Project"** или **"Login"** (через GitHub)
3. Войди через GitHub

### Шаг 2: Создать проект

1. Нажми **"Deploy from GitHub repo"**
2. Выбери репозиторий **FROGFACE-STUDIO**
3. Railway начнет автоматический деплой (может занять 2-3 минуты)

### Шаг 3: Настроить переменные окружения

1. В проекте Railway нажми на сервис (или создай новый если нужно)
2. Перейди в **"Variables"** (вкладка слева)
3. Нажми **"New Variable"** и добавь:

```
OPENROUTER_API_KEY=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
```

Нажми **"Add"**, затем добавь следующую:

```
SUPABASE_URL=https://ydpcfolffvatbweiuekn.supabase.co
```

И еще одну:

```
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcGNmb2xmZnZhdGJ3ZWl1ZWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYzODE5OCwiZXhwIjoyMDc3MjE0MTk4fQ.Z6S4C6eOcRsb-6cTpId11PtpuNz_-0jzYVK1qt2rN4g
```

И последняя:

```
NODE_ENV=production
```

**⚠️ Важно:** Railway автоматически создает переменную `PORT`, поэтому `MCP_PORT` НЕ добавляй!

### Шаг 4: Настроить деплой (если Railway не определил автоматически)

1. Перейди в **"Settings"**
2. Найди **"Root Directory"** или **"Service Path"**
3. Укажи: `packages/core/mcp-server`
4. **Build Command:** `cd ../.. && pnpm install && pnpm --filter @frogface/core-mcp build`
5. **Start Command:** `cd packages/core/mcp-server && pnpm start`

### Шаг 5: Получить URL

1. После деплоя Railway даст URL
2. Если нет - нажми **"Settings"** → **"Generate Domain"**
3. **Скопируй URL** (типа `https://xxx.railway.app`)

### Шаг 6: Проверить что работает

Открой URL в браузере → должно быть:
```json
{
  "name": "Frogface Studio MCP Server",
  "version": "0.1.0",
  "status": "running"
}
```

**Проверь логи если не работает:**
- Railway → Service → Deployments → последний деплой → View Logs

---

## ✅ После успешного деплоя

**Скопируй Railway URL** и переходи к деплою на Vercel (следующий шаг)!

**Railway URL =** `https://xxx.railway.app` (запомни его!)

---

**Начни с Railway! Когда получишь URL - скажи, продолжим с Vercel!** 🚀

