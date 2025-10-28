# 🔧 ОКОНЧАТЕЛЬНОЕ РЕШЕНИЕ для Railway

## 🔍 Проблема

Build не выполняется - `dist/server.js` не создается.

## ✅ Решение 1: Использовать start:prod (уже обновлено!)

Я обновил `package.json` чтобы `start:prod` сначала собирал проект:

```json
"start:prod": "pnpm build && node dist/server.js"
```

И обновил `railway.toml`:
```toml
startCommand = "cd packages/core/mcp-server && pnpm start:prod"
```

**Что делать:**
1. Обновился на GitHub (запушено)
2. В Railway нажми **Redeploy**
3. Railway использует новый `start:prod` который сначала соберет проект

## ✅ Решение 2: Вручную в Railway

Если `railway.toml` не работает, в Railway Settings:

**Start Command:**
```
cd packages/core/mcp-server && pnpm install && pnpm build && node dist/server.js
```

**Build Command (если есть отдельное поле):**
```
cd /app && pnpm install && pnpm --filter @frogface/core-mcp build
```

**Root Directory:** оставь ПУСТЫМ

## ✅ Решение 3: Альтернативный подход (если все не работает)

Использовать tsx напрямую (без компиляции):

**Start Command:**
```
cd packages/core/mcp-server && pnpm exec tsx src/server.ts
```

Но для этого нужно установить tsx в dependencies (не только devDependencies).

---

## 🔄 Попробуй сейчас:

1. **Redeploy в Railway** - используй новый `start:prod`
2. **Проверь логи** - должно быть "Building..." и потом "Starting..."
3. Если не работает - используй Решение 2 или 3

---

**Я обновил package.json и railway.toml - попробуй Redeploy!** 🚀

