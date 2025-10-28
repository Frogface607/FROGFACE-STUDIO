# 🔧 ФИНАЛЬНОЕ РЕШЕНИЕ для Railway

## ❌ Проблема

Railway не видит изменения из `railway.toml` - возможно используется устаревший `railway.json` или настройки в UI перебивают файл.

## ✅ Что сделано

1. **Удалил `railway.json`** - был конфликт
2. **Упростил `railway.toml`** - теперь `startCommand` делает всё за раз:
   ```toml
   startCommand = "cd packages/core/mcp-server && pnpm install && pnpm build && node dist/server.js"
   ```
3. **Запушил на GitHub**

---

## 🔄 ЧТО ДЕЛАТЬ СЕЙЧАС (ШАГ ЗА ШАГОМ)

### Вариант 1: Вручную в Railway UI (РЕКОМЕНДУЕТСЯ)

1. Зайди в **Railway Dashboard** → твой проект
2. Перейди в **Settings** (шестерёнка слева)
3. В разделе **"Deploy"** найди:
   - **Root Directory** - сделай ПУСТЫМ (удали всё что там есть!)
   - **Build Command** - оставь пустым ИЛИ удали
   - **Start Command** - скопируй и вставь ТОЧНО ЭТО (без кавычек):
     ```
     cd packages/core/mcp-server && pnpm install && pnpm build && node dist/server.js
     ```
4. Нажми **"Save"** или **"Update"**
5. Перейди в **Deployments**
6. Нажми **"Redeploy"** или создай новый деплой

### Вариант 2: Использовать railway.toml (если UI не работает)

Railway должен автоматически подхватить `railway.toml` при следующем деплое.

1. В Railway → Deployments
2. Нажми **"Redeploy"** или **"Deploy Latest"**
3. Проверь логи - должна выполниться команда из `railway.toml`

---

## 🔍 ПРОВЕРКА

После redeploy в логах должно быть:

```
Installing dependencies...
Building packages...
Build complete!
Starting server...
Server listening on port 3001
```

---

## ⚠️ ЕСЛИ ВСЁ ЕЩЁ НЕ РАБОТАЕТ

### Альтернативное решение - запуск через tsx (без компиляции)

1. В Railway Settings → Start Command:
   ```
   cd packages/core/mcp-server && pnpm install && pnpm exec tsx src/server.ts
   ```

2. Но сначала нужно переместить `tsx` из `devDependencies` в `dependencies`:
   ```bash
   # В packages/core/mcp-server/package.json переместить tsx
   ```

---

## 💡 ПОЧЕМУ МОЖЕТ НЕ РАБОТАТЬ

1. **Root Directory указан** - должен быть ПУСТЫМ
2. **Build Command в UI** перебивает `railway.toml` - удали его
3. **Railway кэширует старые настройки** - попробуй создать новый сервис

---

**ГЛАВНОЕ: Сделай настройки вручную в Railway UI (Вариант 1) - это самый надежный способ!** 🚀

