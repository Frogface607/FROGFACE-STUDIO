# ⚡ БЫСТРЫЙ ДЕПЛОЙ (3 шага)

## 🎯 Сейчас сделаем за 15 минут

### Шаг 1: GitHub (2 минуты)

```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO"

# Если нет git
git init
git add .
git commit -m "Initial commit"

# Добавь свой GitHub username
git remote add origin https://github.com/твой-username/frogface-studio.git
git branch -M main
git push -u origin main
```

### Шаг 2: Railway (5 минут)

1. Зайди на https://railway.app → Login через GitHub
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Выбери `frogface-studio`
4. **Settings** → **Variables** → Добавь:

```
OPENROUTER_API_KEY=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
SUPABASE_URL=https://ydpcfolffvatbweiuekn.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkcGNmb2xmZnZhdGJ3ZWl1ZWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTYzODE5OCwiZXhwIjoyMDc3MjE0MTk4fQ.Z6S4C6eOcRsb-6cTpId11PtpuNz_-0jzYVK1qt2rN4g
NODE_ENV=production
```

5. **Settings** → **Root Directory:** `packages/core/mcp-server`
6. Скопируй URL Railway (типа `https://xxx.railway.app`)

### Шаг 3: Vercel (3 минуты)

1. Зайди на https://vercel.com → Login через GitHub
2. **"Add New Project"** → Import `frogface-studio`
3. **Root Directory:** `apps/web`
4. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://xxx.railway.app
   ```
   (вставь URL из Railway!)
5. **Deploy** → Готово! 🎉

---

**Готов начинать? Скажи с какого шага!** 🚀

