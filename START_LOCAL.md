# 🚀 Запуск локально

## ✅ Текущий статус

- ✅ Git репозиторий создан
- ✅ Код закоммичен
- ✅ Конфигурация для деплоя готова
- ⚠️ Локально еще не запускали

## 🔧 Запуск в первый раз

### 1. Убедись что зависимости установлены

```bash
pnpm install
```

### 2. Проверь .env.local

```bash
# Должен существовать .env.local с OPENROUTER_API_KEY
cat .env.local
```

Если нет, создай:
```bash
cp .env.example .env.local
# И добавь OPENROUTER_API_KEY
```

### 3. Запусти MCP-сервер

**Терминал 1:**
```bash
cd packages/core/mcp-server
pnpm dev
```

Должно появиться:
```
🚀 MCP Server запущен на http://0.0.0.0:3001
📋 Доступно агентов: 2
```

### 4. Запусти Web UI

**Терминал 2:**
```bash
cd apps/web
pnpm dev
```

Должно появиться:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

### 5. Открой в браузере

http://localhost:3000

## 🐛 Если что-то не работает

### Ошибка "Command not found: dev"

Значит `tsx` не установлен. Выполни:
```bash
cd packages/core/mcp-server
pnpm install
```

### Ошибка "OPENROUTER_API_KEY не установлен"

Проверь `.env.local` в корне проекта. Ключ должен быть там.

### Ошибка "Cannot find module"

Собери пакеты:
```bash
pnpm --filter "@frogface/core-*" build
pnpm --filter "@frogface/agent-*" build
```

### Порт занят

Измени порты в `.env.local`:
```
MCP_PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

И перезапусти оба сервиса.

## ✅ После успешного запуска

1. Открой http://localhost:3000
2. Должны появиться агенты: copywriter, archivist
3. Попробуй написать агенту: "Создай пост про концерт"
4. Попробуй архивариус: нажми "📦 Архивариус" и загрузи текст

## 🎯 Следующие шаги

После того как локально работает:
1. Создай репозиторий на GitHub (см. [SETUP_GIT.md](./SETUP_GIT.md))
2. Запушь код: `git push -u origin main`
3. Подключи к Vercel для фронтенда (см. [DEPLOY.md](./DEPLOY.md))
4. Подключи к Railway для бэкенда (см. [DEPLOY.md](./DEPLOY.md))

---

**Готово запускать?** Выполни команды выше и проверь что всё работает! 🚀

