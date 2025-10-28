# 🚀 Быстрый запуск - Финальная инструкция

## ⚡ Запуск в 2 терминалах

### Терминал 1: MCP Server

```powershell
# Перейди в корень проекта
cd "C:\Users\Sergey\FROGFACE STUDIO"

# Установи зависимости (если еще не установлены)
pnpm install

# Перейди в MCP Server
cd packages\core\mcp-server

# Установи зависимости для этого пакета
pnpm install

# Установи переменные окружения
$env:OPENROUTER_API_KEY="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"
$env:MCP_PORT="3001"

# Запусти сервер
npx tsx src/server.ts
```

**Должно появиться:**
```
🚀 MCP Server запущен на http://0.0.0.0:3001
📋 Доступно агентов: 2
```

### Терминал 2: Web UI

```powershell
# Перейди в корень проекта
cd "C:\Users\Sergey\FROGFACE STUDIO"

# Перейди в Web UI
cd apps\web

# Установи зависимости (если еще не установлены)
pnpm install

# Запусти Web UI
pnpm dev
```

**Должно появиться:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

### Открой в браузере

http://localhost:3000

## ✅ Что должно работать

1. **Главная страница** с заголовком "Frogface Studio"
2. **Кнопка "📦 Архивариус"** - для загрузки знаний
3. **Вкладки с агентами:**
   - copywriter
   - archivist
4. **Чат интерфейс** для общения с агентами

## 🐛 Если что-то не работает

### Ошибка "Cannot find module 'fastify'"

Установи зависимости в MCP Server:
```powershell
cd packages\core\mcp-server
pnpm add fastify @fastify/cors @fastify/multipart tsx
```

### Ошибка "Cannot find module '@frogface/...'"

Установи зависимости для всех пакетов:
```powershell
cd packages\core\api-client
pnpm install

cd ..\knowledge-base
pnpm install

cd ..\agent-base
pnpm install

cd ..\..\agents\copywriter
pnpm install

cd ..\archivist
pnpm install
```

### Порт занят

Измени порт в переменных окружения:
```powershell
$env:MCP_PORT="3002"
```

И обнови `.env.local`:
```
MCP_PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Web UI не подключается к MCP Server

1. Проверь что MCP Server запущен на порту 3001
2. Проверь `NEXT_PUBLIC_API_URL` в `.env.local`
3. Проверь CORS настройки

## 📝 Полная документация

- [RUN_LOCAL.md](./RUN_LOCAL.md) - Детальная инструкция
- [START_LOCAL.md](./START_LOCAL.md) - Альтернативные способы
- [STATUS.md](./STATUS.md) - Текущий статус

---

**После успешного запуска у тебя будет полностью рабочая платформа!** 🎉


