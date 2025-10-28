# ▲ ДЕПЛОЙ НА VERCEL (После Railway!)

## ⏳ Подожди пока получишь Railway URL!

**Сначала деплой Railway должен быть готов** (получи URL типа `https://xxx.railway.app`)

## 🚀 Деплой на Vercel (3 минуты)

### Шаг 1: Зайти на Vercel

1. Открой https://vercel.com
2. **"Sign Up"** или **"Login"** (через GitHub)
3. Войди через GitHub

### Шаг 2: Импортировать проект

1. Нажми **"Add New..."** → **"Project"**
2. Найди репозиторий **FROGFACE-STUDIO**
3. Нажми **"Import"**

### Шаг 3: Настроить проект

**Configure Project:**

- **Framework Preset:** Next.js (автоопределится)
- **Root Directory:** `apps/web` ⚠️ **ВАЖНО!**
- **Build Command:** Оставь как есть или измени на:
  ```
  cd ../.. && pnpm install && pnpm --filter @frogface/web build
  ```
- **Output Directory:** `.next` (по умолчанию)
- **Install Command:** Оставь как есть

### Шаг 4: Добавить переменные окружения

Перед деплоем нажми **"Environment Variables"** и добавь:

```
NEXT_PUBLIC_API_URL=https://xxx.railway.app
```

⚠️ **Замени `xxx.railway.app` на реальный URL из Railway!**

### Шаг 5: Деплой

1. Нажми **"Deploy"**
2. Подожди 2-3 минуты пока собирается
3. Vercel даст URL (типа `https://frogface-studio.vercel.app`)

### Шаг 6: Проверка

1. Открой URL от Vercel в браузере
2. Должна быть страница "Frogface Studio"
3. Должны быть вкладки с агентами
4. Попробуй отправить сообщение агенту

---

## ✅ После деплоя

У тебя будет:
- 🌐 **Frontend:** Vercel URL (используй его!)
- 🔧 **Backend:** Railway URL (работает в фоне)
- 📊 **База знаний:** Supabase (все данные сохраняются)

**Всё готово! Используй платформу откуда угодно!** 🚀

---

**Сначала деплой Railway, потом Vercel!** 

