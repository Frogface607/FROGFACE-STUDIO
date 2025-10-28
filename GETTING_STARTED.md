# 🚀 Быстрый старт - Frogface Studio

## Шаг 1: Установка зависимостей

```bash
# Убедись что у тебя установлен Node.js >= 18 и pnpm >= 8
node --version
pnpm --version

# Если pnpm не установлен:
npm install -g pnpm

# Установка всех зависимостей проекта
pnpm install
```

## Шаг 2: Настройка переменных окружения

```bash
# Скопируй пример конфигурации
cp .env.example .env.local

# Отредактируй .env.local и добавь свои ключи:
# - OPENROUTER_API_KEY (обязательно!)
# - Остальные ключи по желанию
```

### Где взять ключи?

**OpenRouter API Key** (обязательно):
1. Зайди на https://openrouter.ai/
2. Зарегистрируйся или войди
3. Перейди в Settings → Keys
4. Создай новый ключ
5. Скопируй его в `.env.local`

**Остальные ключи** (опционально, для будущих интеграций):
- Firebase - для RAG системы (пока можно пропустить)
- Canva API - для создания постеров
- VK API - для публикации в VK
- Telegram Bot - для Telegram бота

## Шаг 3: Сборка core пакетов

```bash
# Собери все core пакеты
pnpm --filter "@frogface/core-*" build
```

## Шаг 4: Создание и регистрация первого агента

### 4.1 Собери агента копирайтер

```bash
pnpm --filter "@frogface/agent-copywriter" build
```

### 4.2 Зарегистрируй агента в MCP-сервере

Открой `packages/core/mcp-server/src/register-agents.ts` и раскомментируй:

```typescript
import { CopywriterAgent } from '@frogface/agent-copywriter'

export function registerAllAgents() {
  agentRegistry.register(new CopywriterAgent())
  // ... другие агенты
}
```

### 4.3 Собери MCP-сервер

```bash
pnpm --filter "@frogface/core-mcp" build
```

## Шаг 5: Запуск системы

### Терминал 1: MCP-сервер

```bash
pnpm mcp:dev
# или
pnpm --filter "@frogface/core-mcp" dev
```

Должно появиться:
```
🚀 MCP Server запущен на http://0.0.0.0:3001
📋 Доступно агентов: 1
```

### Терминал 2: Web UI

```bash
pnpm dev
# или
pnpm --filter "@frogface/web" dev
```

Открой http://localhost:3000 в браузере.

## Шаг 6: Тестирование

### Через UI

1. Открой http://localhost:3000
2. Выбери агента "copywriter" во вкладках
3. Напиши в чат: "Создай пост про новый концерт Embers"
4. Нажми Enter или кнопку "Отправить"
5. Дождись ответа от агента

### Через API напрямую

```bash
# Список всех агентов
curl http://localhost:3001/mcp/agents

# Выполнить задачу
curl -X POST http://localhost:3001/mcp/agents/copywriter/task \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "id": "test-1",
      "prompt": "Создай пост про новый концерт Embers"
    }
  }'

# Статус системы
curl http://localhost:3001/mcp/status
```

## 🎯 Что дальше?

### Добавить нового агента

1. Создай папку `packages/agents/your-agent/`
2. Создай `package.json` и `tsconfig.json` (скопируй из copywriter)
3. Реализуй класс агента, наследуясь от `BaseAgent`
4. Зарегистрируй в `register-agents.ts`
5. Собери и перезапусти MCP-сервер

Подробнее в [ARCHITECTURE.md](./ARCHITECTURE.md)

### Улучшить RAG систему

Сейчас используется in-memory хранилище. Для production:
- Настрой Firebase/Firestore
- Или используй ChromaDB локально
- Обнови `packages/core/knowledge-base/src/index.ts`

### Добавить интеграции

Создай пакеты в `packages/integrations/`:
- `canva/` - для Canva API
- `vk/` - для VK API
- `telegram/` - для Telegram Bot API

## 🐛 Решение проблем

### Ошибка "OPENROUTER_API_KEY не установлен"

- Убедись что `.env.local` существует
- Проверь что ключ правильно прописан
- Перезапусти MCP-сервер

### Ошибка "Агент не найден"

- Убедись что агент зарегистрирован в `register-agents.ts`
- Проверь что пакет агента собран (`pnpm build`)
- Перезапусти MCP-сервер

### UI не подключается к MCP-серверу

- Проверь что MCP-сервер запущен на порту 3001
- Убедись что `NEXT_PUBLIC_API_URL` в `.env.local` правильный
- Проверь CORS настройки в MCP-сервере

### Порт уже занят

Измени порт в `.env.local`:
```env
MCP_PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## 📚 Дополнительная документация

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура системы
- [ROADMAP.md](./ROADMAP.md) - Дорожная карта
- [STRATEGY.md](./STRATEGY.md) - Стратегия развития

---

**Готово! Теперь у тебя запущена базовая версия Frogface Studio** 🎉

Добавляй агентов, улучшай систему, экспериментируй!

