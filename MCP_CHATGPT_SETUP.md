# 🤖 Подключение ChatGPT к Frogface Studio через MCP

## 🎯 Что это даёт

После подключения ChatGPT сможет:
- ✅ Вызывать твоих агентов напрямую (копирайтер, архивариус и т.д.)
- ✅ Искать информацию в базе знаний
- ✅ Архивировать контент через архивариуса
- ✅ Управлять всей платформой голосом или текстом

## 📋 Требования

- ✅ Frogface Studio запущен локально
- ✅ Node.js установлен
- ✅ ChatGPT с поддержкой MCP (ChatGPT Desktop или через API)

## 🚀 Настройка (пошагово)

### Вариант 1: ChatGPT Desktop App (рекомендуется)

#### Шаг 1: Установи ChatGPT Desktop

Если еще не установлен:
- Скачай с https://chat.openai.com/
- Или используй через браузер с MCP расширением

#### Шаг 2: Создай конфигурацию MCP

Создай файл конфигурации MCP для ChatGPT:

**Windows:**
```
%APPDATA%\Roaming\ChatGPT\mcp.json
```

**macOS:**
```
~/Library/Application Support/ChatGPT/mcp.json
```

**Linux:**
```
~/.config/ChatGPT/mcp.json
```

#### Шаг 3: Конфигурация MCP

Вставь такую конфигурацию:

```json
{
  "mcpServers": {
    "frogface-studio": {
      "command": "node",
      "args": [
        "C:/Users/Sergey/FROGFACE STUDIO/packages/core/mcp-server/dist/mcp-stdio.js"
      ],
      "env": {
        "OPENROUTER_API_KEY": "твой_ключ_открыт_здесь_или_через_env"
      }
    }
  }
}
```

**Важно:** 
- Замени путь на **абсолютный** путь к твоему проекту
- Или используй переменные окружения для ключей

#### Шаг 4: Собери MCP stdio модуль

```bash
cd packages/core/mcp-server
pnpm build
```

Убедись что создался файл `dist/mcp-stdio.js`

#### Шаг 5: Перезапусти ChatGPT

Перезапусти ChatGPT Desktop, чтобы он подхватил новую конфигурацию.

#### Шаг 6: Проверь подключение

В ChatGPT спроси:
```
"Какие агенты доступны в Frogface Studio?"
```

ChatGPT должен вызвать `list_agents` и показать список.

### Вариант 2: Через HTTP Transport (альтернатива)

Если stdio не работает, можно использовать HTTP:

1. Запусти MCP-сервер:
   ```bash
   cd packages/core/mcp-server
   pnpm dev
   ```

2. Используй ngrok или локальный туннель:
   ```bash
   ngrok http 3001
   ```

3. В конфигурации MCP укажи HTTP endpoint вместо stdio.

## 🎮 Использование

После подключения ChatGPT может использовать команды:

### Примеры команд для ChatGPT:

```
"Создай анонс концерта Embers через копирайтера"
→ ChatGPT вызывает execute_agent_task с agent_id: "copywriter"

"Заархивируй этот текст: [текст]"
→ ChatGPT вызывает archive_content

"Найди в базе знаний информацию про посты для VK"
→ ChatGPT вызывает search_knowledge

"Какие агенты доступны?"
→ ChatGPT вызывает list_agents
```

## 🔧 Доступные инструменты (Tools)

ChatGPT видит эти инструменты:

### 1. `list_agents`
Получить список всех агентов

### 2. `execute_agent_task`
Выполнить задачу через агента
- `agent_id`: copywriter, archivist, и т.д.
- `prompt`: задача для агента
- `context`: дополнительный контекст

### 3. `archive_content`
Архивировать контент через архивариуса
- `content`: текст для архивации
- `metadata`: опциональные метаданные

### 4. `search_knowledge`
Поиск в базе знаний
- `query`: поисковый запрос
- `namespace`: copywriter, researcher, global и т.д.
- `limit`: количество результатов

## 🐛 Troubleshooting

### Ошибка "Command not found"

Проверь что путь к `mcp-stdio.js` абсолютный и правильный:
```bash
# Проверь что файл существует
ls packages/core/mcp-server/dist/mcp-stdio.js
```

### Ошибка "Cannot find module"

Собери проект:
```bash
cd packages/core/mcp-server
pnpm install
pnpm build
```

### ChatGPT не видит инструменты

1. Проверь конфигурацию MCP (правильный путь, JSON валидный)
2. Перезапусти ChatGPT Desktop
3. Проверь логи в консоли ChatGPT (если доступны)

### Ошибка "OPENROUTER_API_KEY not set"

Либо добавь ключ в конфигурацию MCP:
```json
"env": {
  "OPENROUTER_API_KEY": "sk-or-v1-..."
}
```

Либо установи как системную переменную окружения.

## 🔒 Безопасность

**ВАЖНО:** Не коммить конфигурацию MCP с ключами в Git!

Вместо этого:
1. Используй переменные окружения в `env` секции
2. Или храни конфигурацию локально и не добавляй в Git

## 🎯 Workflow после подключения

```
Ты (голос/текст) → ChatGPT
    ↓
ChatGPT анализирует запрос
    ↓
ChatGPT вызывает нужный инструмент MCP
    ↓
Frogface Studio MCP сервер
    ↓
Оркестрирует агентов
    ↓
Результат → ChatGPT → Тебе
```

## 📚 Дополнительно

- [MCP Protocol Specification](https://modelcontextprotocol.io/) (если нужны детали протокола)
- [ChatGPT MCP Documentation](https://platform.openai.com/docs/guides/mcp)

---

**После настройки у тебя будет полноценное голосовое управление всей платформой через ChatGPT!** 🎉

