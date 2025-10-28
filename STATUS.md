# 📊 Статус запуска

## ✅ Что сделано

1. ✅ Установлены зависимости из корня проекта
2. ✅ Попытка запуска MCP Server в фоне
3. ✅ Запущен Web UI в отдельном окне

## 🔍 Проверь вручную

### 1. MCP Server

Открой новый терминал и выполни:
```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\packages\core\mcp-server"
$env:OPENROUTER_API_KEY="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"
$env:MCP_PORT="3001"
npx tsx src/server.ts
```

**Ожидаемый вывод:**
```
🚀 MCP Server запущен на http://0.0.0.0:3001
📋 Доступно агентов: 2
```

### 2. Web UI

В другом терминале:
```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO\apps\web"
pnpm dev
```

**Ожидаемый вывод:**
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

### 3. Открой браузер

http://localhost:3000

## ⚠️ Если есть ошибки

### "Cannot find module"
Установи зависимости вручную для каждого пакета (см. RUN_LOCAL.md)

### Порты заняты
Измени порты в `.env.local`:
```
MCP_PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Workspace зависимости не находятся
Временно установи зависимости напрямую в node_modules каждого пакета.

---

**Полная инструкция:** см. [RUN_LOCAL.md](./RUN_LOCAL.md)


