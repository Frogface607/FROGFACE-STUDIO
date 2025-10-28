# 📦 Улучшения Архивариуса

## ✅ Что исправлено и добавлено

### 1. Обработка HTML файлов ✅

**Проблема:** HTML файлы не обрабатывались правильно (бинарные данные, теги)

**Решение:**
- Создан модуль `file-handlers.ts` с парсингом HTML
- Извлечение чистого текста
- Извлечение структуры (заголовки, параграфы, списки)
- Поддержка разных типов файлов (HTML, JSON, TXT, MD)

### 2. CLI инструменты ✅

**Новый инструмент:** `scripts/archivist-cli.ts`

Команды:
```bash
# Добавить текст
pnpm tsx scripts/archivist-cli.ts add "Мой текст"

# Добавить файл
pnpm tsx scripts/archivist-cli.ts add-file file.html

# Поиск
pnpm tsx scripts/archivist-cli.ts search "концерт"

# Список записей
pnpm tsx scripts/archivist-cli.ts list copywriter

# Статистика
pnpm tsx scripts/archivist-cli.ts stats
```

### 3. Массовая загрузка ✅

**Новый инструмент:** `scripts/bulk-load.ts`

```bash
pnpm tsx scripts/bulk-load.ts ./knowledge-source/
```

Автоматически:
- Обходит директорию
- Определяет namespace по имени
- Загружает все файлы

## 🚀 Как использовать локально

### Вариант 1: Через CLI (рекомендуется для начала)

```bash
# Добавь HTML файл
pnpm tsx scripts/archivist-cli.ts add-file "Профиль стиля Edison Craft_ Автоматизация контента.html"

# Или добавь текст
pnpm tsx scripts/archivist-cli.ts add "Твой текст здесь"

# Посмотри что получилось
pnpm tsx scripts/archivist-cli.ts list copywriter
pnpm tsx scripts/archivist-cli.ts stats
```

### Вариант 2: Через Web UI (когда сервер работает)

1. Запусти MCP Server
2. Запусти Web UI
3. Открой http://localhost:3000
4. Нажми "📦 Архивариус"
5. Загружай файлы или текст

### Вариант 3: Массовая загрузка

1. Создай папку `knowledge-source/`
2. Положи туда файлы:
   ```
   knowledge-source/
   ├── copywriter/
   │   └── posts.txt
   ├── researcher/
   │   └── research.md
   └── global/
       └── general.txt
   ```
3. Запусти:
   ```bash
   pnpm tsx scripts/bulk-load.ts ./knowledge-source/
   ```

## 🔧 Исправления

### HTML файлы теперь правильно обрабатываются:
- Извлекается чистый текст
- Сохраняется структура (заголовки, списки)
- Удаляются скрипты и стили
- Декодируются HTML entities

### Улучшена классификация:
- Более точное определение namespace
- Fallback на ключевые слова
- Сохранение категории

## 📝 Примеры использования

### Загрузить HTML файл:
```bash
pnpm tsx scripts/archivist-cli.ts add-file "мой-файл.html"
```

Вывод:
```
📄 Обрабатываю файл: мой-файл.html
📝 Извлечено 5234 символов
📝 Анализирую текст...
✅ Классификация: copywriter - style_guide
✅ Сохранено! ID: copywriter-1234567890-abc123
📁 Namespace: copywriter
```

### Найти информацию:
```bash
pnpm tsx scripts/archivist-cli.ts search "Edison Craft"
```

### Посмотреть статистику:
```bash
pnpm tsx scripts/archivist-cli.ts stats
```

## 🎯 План дальнейших улучшений

- [ ] Визуализация базы знаний в Web UI
- [ ] Редактирование и удаление записей
- [ ] Экспорт базы знаний
- [ ] Улучшенная классификация с обучением
- [ ] Автоматическая дедупликация
- [ ] Версионирование записей

---

**Теперь архивариус готов к работе локально! Используй CLI для быстрого наполнения базы знаний.** 🚀

