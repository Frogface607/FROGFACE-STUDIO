# ⚡ Быстрый запуск - Frogface Studio

## ✅ Уже настроено

- ✅ OpenRouter API ключ добавлен в `.env.local`
- ✅ Агент копирайтер зарегистрирован в MCP-сервере

## 🚀 Запуск (3 команды)

### 1. Установить зависимости
```bash
pnpm install
```

### 2. Собрать все пакеты
```bash
pnpm --filter "@frogface/core-*" build
pnpm --filter "@frogface/agent-copywriter" build
pnpm --filter "@frogface/core-mcp" build
```

### 3. Запустить

**Терминал 1 (MCP-сервер):**
```bash
pnpm mcp:dev
```

**Терминал 2 (Web UI):**
```bash
pnpm dev
```

## 🎯 Проверка работы

1. Открой http://localhost:3000 в браузере
2. Должна появиться вкладка с агентом "copywriter"
3. Напиши в чат: "Создай пост про новый концерт Embers"
4. Нажми Enter

Должен прийти ответ от агента!

## 🐛 Если что-то не работает

### Ошибка "Cannot find module '@frogface/agent-copywriter'"

```bash
# Пересобери пакеты
pnpm --filter "@frogface/agent-copywriter" build
pnpm --filter "@frogface/core-mcp" build
```

### Ошибка "OPENROUTER_API_KEY не установлен"

Проверь что `.env.local` существует и содержит ключ:
```bash
# Windows PowerShell
Get-Content .env.local | Select-String "OPENROUTER"
```

### MCP-сервер не запускается

Проверь что порт 3001 свободен:
```bash
# Windows
netstat -ano | findstr :3001
```

Если занят, измени порт в `.env.local`:
```
MCP_PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## 📞 Что дальше?

После успешного запуска:
- ✅ Попробуй разные запросы копирайтеру
- ✅ Добавь нового агента (см. `GETTING_STARTED.md`)
- ✅ Изучи архитектуру (см. `ARCHITECTURE.md`)

---

**Удачи! 🐸**

