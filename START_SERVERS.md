# 🚀 Быстрый запуск серверов

## ⚠️ Проблема с workspace зависимостями

Сейчас есть проблема с pnpm workspace - пакеты не находят друг друга. 

## ✅ Временное решение - запуск вручную

### 1. Убедись что .env.local существует

Файл `.env.local` должен содержать:
```
OPENROUTER_API_KEY=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
MCP_PORT=3001
MCP_HOST=localhost
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Установи зависимости глобально

```bash
# В корне проекта
pnpm install
```

### 3. Запусти MCP Server

**Терминал 1:**
```powershell
cd packages/core/mcp-server
$env:OPENROUTER_API_KEY="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"
$env:MCP_PORT="3001"
npx tsx src/server.ts
```

### 4. Запусти Web UI  

**Терминал 2:**
```powershell
cd apps/web
pnpm dev
```

## 🔧 Если не работает

Проблема может быть в том, что пакеты не собраны. Нужно:

1. Собрать все core пакеты
2. Убедиться что все зависимости установлены

**Или используй готовые скрипты:**

```powershell
# Запуск MCP (в одном терминале)
.\start-mcp.ps1

# Запуск Web (в другом терминале)  
.\start-web.ps1
```

## 🎯 После запуска

- MCP Server: http://localhost:3001
- Web UI: http://localhost:3000

Открой http://localhost:3000 в браузере!


