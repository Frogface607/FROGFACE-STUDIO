# 🚀 ЗАПУСК ЗДЕСЬ - Простые команды

## Ключ OpenRouter API встроен в команды! 🔑

### Вариант 1: Использовать готовые скрипты (САМЫЙ ПРОСТОЙ)

**Терминал 1 - MCP Server:**
```powershell
.\start-mcp-server.ps1
```

**Терминал 2 - Web UI:**
```powershell
.\start-web-ui.ps1
```

---

### Вариант 2: Команды напрямую

**Терминал 1 - MCP Server:**
```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\packages\core\mcp-server"
$env:OPENROUTER_API_KEY="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"
$env:MCP_PORT="3001"
npx tsx src/server.ts
```

**Терминал 2 - Web UI:**
```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\apps\web"
pnpm dev
```

---

## ⚠️ Если ошибка "Cannot find module 'fastify'"

Сначала установи зависимости:
```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\packages\core\mcp-server"
pnpm add fastify @fastify/cors @fastify/multipart tsx --save
```

---

## ✅ После запуска

- MCP Server: http://localhost:3001
- Web UI: http://localhost:3000

Открой **http://localhost:3000** в браузере!

---

**Ключ встроен в команды - просто скопируй и запусти!** 🎉


