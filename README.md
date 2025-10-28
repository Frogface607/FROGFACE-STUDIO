# 🐸 Frogface Studio

Единая AI-экосистема для управления специализированными агентами через единый интерфейс.

[![Deploy](https://github.com/yourusername/frogface-studio/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/frogface-studio/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Концепция

Frogface Studio - это платформа, где каждый агент - это специализированный помощник:
- **Копирайтер** - генерирует посты, анонсы, тексты
- **Архивариус** - умно организует и сохраняет информацию в RAG
- **Исследователь** - собирает и систематизирует информацию
- **SMM менеджер** - планирует контент и анализирует метрики
- **Постер** - создает дизайны через Canva API
- **Психолог** - анализирует эмоции и ведет дневник
- **Оркестратор** - управляет сложными задачами
- **Кросс-постер** - автоматически публикует в соцсети

Все агенты работают через единый **MCP-сервер**, имеют доступ к общей **базе знаний (RAG)**, и могут управляться **голосом** через ChatGPT.

## ✨ Особенности

- 🤖 **Модульная архитектура** - легко добавлять новых агентов
- 🧠 **RAG система** - долгосрочная память для всех агентов
- 📦 **Архивариус** - автоматическая организация знаний
- 🔌 **OpenRouter** - единая точка доступа к LLM
- 🎨 **Современный UI** - Next.js + React + Tailwind CSS
- 🚀 **Готово к деплою** - Vercel + Railway

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонируй репозиторий
git clone https://github.com/yourusername/frogface-studio.git
cd frogface-studio

# Установи зависимости
pnpm install

# Настрой переменные окружения
cp .env.example .env.local
# Заполни OPENROUTER_API_KEY в .env.local

# Запусти MCP-сервер (терминал 1)
cd packages/core/mcp-server
pnpm dev

# Запусти Web UI (терминал 2)
cd apps/web
pnpm dev
```

Открой http://localhost:3000

### Деплой

1. **Frontend (Vercel):**
   - Подключи репозиторий к Vercel
   - Root Directory: `apps/web`
   - Environment Variables: `NEXT_PUBLIC_API_URL`

2. **Backend (Railway):**
   - Подключи репозиторий к Railway
   - Root Directory: `packages/core/mcp-server`
   - Environment Variables: `OPENROUTER_API_KEY`, `MCP_PORT`

Подробнее в [DEPLOY.md](./DEPLOY.md)

## 📁 Структура проекта

```
frogface-studio/
├── packages/
│   ├── core/              # Ядро платформы
│   │   ├── mcp-server/    # MCP-сервер (оркестратор)
│   │   ├── agent-base/    # Базовый класс агента
│   │   ├── knowledge-base/# RAG система
│   │   └── api-client/    # OpenRouter клиент
│   ├── agents/            # Специализированные агенты
│   │   ├── copywriter/    # Копирайтер
│   │   └── archivist/     # Архивариус
│   └── integrations/      # Внешние API интеграции
├── apps/
│   └── web/               # Next.js приложение (UI)
└── knowledge/             # База знаний (RAG)
```

## 📚 Документация

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Архитектура системы
- [ROADMAP.md](./ROADMAP.md) - Дорожная карта
- [STRATEGY.md](./STRATEGY.md) - Стратегия развития
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Инструкции по запуску
- [KNOWLEDGE_GUIDE.md](./KNOWLEDGE_GUIDE.md) - Руководство по RAG
- [ARCHIVIST_GUIDE.md](./ARCHIVIST_GUIDE.md) - Руководство по архивариусу
- [DEPLOY.md](./DEPLOY.md) - Инструкции по деплою

## 🛠️ Технологии

- **Backend:** Node.js, TypeScript, Fastify
- **Frontend:** Next.js 14, React 18, Tailwind CSS
- **AI:** OpenRouter API
- **Monorepo:** pnpm workspaces
- **Deploy:** Vercel (Frontend), Railway/Render (Backend)

## 🎓 Разработка

### Добавление нового агента

1. Создай папку `packages/agents/your-agent/`
2. Наследуйся от `BaseAgent`
3. Реализуй методы `execute()` и `getCapabilities()`
4. Зарегистрируй в `packages/core/mcp-server/src/register-agents.ts`

**Время на создание агента: ~1 час**

### Тестирование

```bash
# Запуск тестов (когда будут добавлены)
pnpm test

# Линтинг
pnpm lint
```

## 📝 Лицензия

MIT

## 🤝 Вклад

Приветствуются pull requests! Для больших изменений сначала открой issue.

## 📞 Контакты

Создано с ❤️ для Frogface Studio

---

**Статус:** 🟢 В разработке | **Версия:** 0.1.0
