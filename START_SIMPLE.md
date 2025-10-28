# 🚀 ПРОСТОЙ ЗАПУСК - Ключ встроен!

## 🔑 Ключ OpenRouter уже в командах!

### Шаг 1: Запусти MCP Server

Скопируй и выполни в терминале:

```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\packages\core\mcp-server"
$env:OPENROUTER_API_KEY="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"
$env:MCP_PORT="3001"
npx tsx src/server.ts
```

**Или используй скрипт:**
```powershell
.\start-mcp-server.ps1
```

---

### Шаг 2: Запусти Web UI

В другом терминале:

```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\apps\web"
pnpm dev
```

**Или используй скрипт:**
```powershell
.\start-web-ui.ps1
```

---

### Шаг 3: Открой браузер

http://localhost:3000

---

## ⚠️ Если ошибка "Cannot find module"

Выполни сначала (в папке mcp-server):
```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\packages\core\mcp-server"
npm install fastify @fastify/cors @fastify/multipart tsx --no-save
```

---

**Ключ встроен - просто запускай!** ✅


