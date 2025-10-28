# 🚀 Как запустить локально (Руководство)

## ⚠️ Текущая проблема

Есть проблема с pnpm workspace - зависимости не резолвятся автоматически. 

## ✅ Решение: Установка зависимостей вручную

### Шаг 1: Установи все зависимости из корня

```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO"
pnpm install
```

Это установит зависимости для всех пакетов.

### Шаг 2: Установи зависимости для каждого пакета отдельно

```powershell
# Core пакеты
cd packages/core/api-client
pnpm install

cd ../knowledge-base
pnpm install

cd ../agent-base  
pnpm install

# Агенты
cd ../../agents/copywriter
pnpm install

cd ../archivist
pnpm install

# MCP Server
cd ../../core/mcp-server
pnpm install
```

### Шаг 3: Запусти MCP Server

**Терминал 1:**
```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\packages\core\mcp-server"
$env:OPENROUTER_API_KEY="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"
$env:MCP_PORT="3001"
npx tsx src/server.ts
```

Должно появиться:
```
🚀 MCP Server запущен на http://0.0.0.0:3001
📋 Доступно агентов: 2
```

### Шаг 4: Запусти Web UI

**Терминал 2:**
```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\apps\web"
pnpm dev
```

Должно появиться:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

### Шаг 5: Открой в браузере

http://localhost:3000

## 🔧 Альтернативный способ (если не работает)

Можно временно установить зависимости напрямую в node_modules каждого пакета:

```powershell
cd packages/core/mcp-server
npm install fastify @fastify/cors @fastify/multipart tsx
```

Но лучше исправить workspace конфигурацию.

## 📝 Проверка

После запуска:
1. MCP Server должен отвечать на http://localhost:3001
2. Web UI должен открыться на http://localhost:3000
3. В UI должны появиться 2 агента: copywriter и archivist

---

**Если проблемы остаются, проверь логи в терминалах!**


