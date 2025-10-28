# 🔧 Исправление Railway деплоя

## ❌ Проблема

Railway не собирает проект - файл `dist/server.js` не создается.

## ✅ Решение 1: Обновить настройки в Railway

1. Зайди в Railway → твой проект → Settings
2. В разделе **"Build & Deploy"**:

**Build Command:**
```
cd /app && pnpm install && pnpm --filter @frogface/core-mcp build
```

**Start Command:**
```
cd packages/core/mcp-server && node dist/server.js
```

**Root Directory:**
```
packages/core/mcp-server
```

⚠️ **Важно:** НЕ ставь Root Directory! Оставь пустым или `/`.

3. Сохрани
4. Перезапусти деплой (Deployments → Redeploy)

## ✅ Решение 2: Использовать tsx напрямую (быстрое решение)

Если build не работает, можно запускать через tsx:

1. Railway → Settings → **Start Command:**
```
cd packages/core/mcp-server && pnpm exec tsx src/server.ts
```

2. Но нужно установить tsx в production dependencies

## ✅ Решение 3: Исправить build (правильное решение)

Проблема может быть в том что:
1. Build команда не выполняется
2. TypeScript компиляция не создает файлы

**Проверь в Railway:**
1. Deployments → последний деплой → View Logs
2. Посмотри есть ли там "Building..." или ошибки компиляции

**Если build не выполняется:**

В Railway Settings добавь явную **Build Command**:
```
pnpm install && pnpm --filter @frogface/core-mcp build
```

**Root Directory оставь пустым** (не `packages/core/mcp-server`)!

## 🔍 Проверка

После исправления проверь логи Railway:
- Должно быть "Building..."
- Должно быть "Build complete"
- Потом "Starting..."

## ⚡ Быстрое решение прямо сейчас

**В Railway Settings:**

1. **Root Directory:** оставь пустым (НЕ указывай путь)
2. **Build Command:** 
   ```
   pnpm install && pnpm --filter @frogface/core-mcp build
   ```
3. **Start Command:**
   ```
   cd packages/core/mcp-server && node dist/server.js
   ```

4. **Redeploy** (перезапусти деплой)

---

**Попробуй Решение 1 - должно помочь!** 🚀

