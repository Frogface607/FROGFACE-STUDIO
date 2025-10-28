# 🏠 Локальная работа с Архивариусом

## 🎯 Цель сегодня: Довести архивариуса до ума и заполнить базу знаний

### ✅ Что уже готово

1. ✅ Обработка HTML файлов (парсинг, извлечение текста)
2. ✅ CLI инструменты для локальной работы
3. ✅ Улучшенная классификация контента
4. ✅ Массовая загрузка файлов

## 🚀 Быстрый старт

### Шаг 1: Установи зависимости для CLI (если нужно)

```bash
cd "C:\Users\Sergey\FROGFACE STUDIO"
pnpm add -D -w dotenv
```

### Шаг 2: Настрой .env.local

Убедись что файл `.env.local` существует с ключом:
```
OPENROUTER_API_KEY=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
```

### Шаг 3: Загрузи свой HTML файл

```bash
pnpm tsx scripts/archivist-cli.ts add-file "Профиль стиля Edison Craft_ Автоматизация контента.html"
```

Архивариус:
1. Распарсит HTML
2. Извлечет чистый текст
3. Проанализирует через AI
4. Определит куда сохранить
5. Сохранит в базу знаний

### Шаг 4: Проверь что получилось

```bash
# Статистика
pnpm tsx scripts/archivist-cli.ts stats

# Список записей
pnpm tsx scripts/archivist-cli.ts list copywriter

# Поиск
pnpm tsx scripts/archivist-cli.ts search "Edison Craft"
```

## 📝 Примеры использования

### Добавить текст вручную:

```bash
pnpm tsx scripts/archivist-cli.ts add "Это пример текста для архивации. Он будет автоматически классифицирован и сохранен."
```

### Добавить несколько файлов:

```bash
# Создай папку с файлами
mkdir knowledge-source
# Положи туда файлы

# Загрузи все разом
pnpm tsx scripts/bulk-load.ts ./knowledge-source/
```

### Найти информацию:

```bash
# Поиск во всех namespace
pnpm tsx scripts/archivist-cli.ts search "концерт"

# Поиск в конкретном namespace
pnpm tsx scripts/archivist-cli.ts search "концерт" copywriter
```

## 💡 Рабочий процесс

### Вариант 1: По одному файлу

```bash
# Загружаешь файл
pnpm tsx scripts/archivist-cli.ts add-file file1.html

# Проверяешь
pnpm tsx scripts/archivist-cli.ts stats

# Загружаешь следующий
pnpm tsx scripts/archivist-cli.ts add-file file2.html
```

### Вариант 2: Массовая загрузка

```bash
# Подготовь структуру
knowledge-source/
├── file1.html
├── file2.md
└── file3.txt

# Загрузи все
pnpm tsx scripts/bulk-load.ts ./knowledge-source/
```

## 🔍 Проверка качества

### Посмотри что сохранилось:

```bash
# Статистика по namespace
pnpm tsx scripts/archivist-cli.ts stats

# Все записи в namespace
pnpm tsx scripts/archivist-cli.ts list copywriter

# Поиск конкретной информации
pnpm tsx scripts/archivist-cli.ts search "ключевое слово"
```

## 🎯 Что дальше после загрузки

После того как база знаний заполнена:

1. **Используй в копирайтере:**
   - Копирайтер найдет примеры из базы
   - Использует их как контекст
   - Создаст более качественный контент

2. **Проверь работу:**
   - Попроси копирайтера создать пост
   - Посмотри использует ли он знания из базы

3. **Дополняй постепенно:**
   - Добавляй новые файлы по мере появления
   - Архивариус автоматически организует

## 📁 Где хранятся знания

Сейчас знания хранятся **in-memory** (в памяти процесса).

Для постоянного хранения:
1. Используй CLI регулярно (знания сохраняются при каждом вызове)
2. Или позже мигрируй на Firebase/Supabase

## 🐛 Troubleshooting

### Ошибка "Cannot find module 'dotenv'"

```bash
pnpm add -D -w dotenv
```

### Ошибка "OPENROUTER_API_KEY not set"

Проверь `.env.local` или установи переменную:
```powershell
$env:OPENROUTER_API_KEY="sk-or-v1-..."
```

### HTML файл не распарсился

Проверь что файл действительно HTML. Архивариус автоматически определит тип по расширению.

---

**Сегодня сосредоточься на архивариусе - загружай файлы и наполняй базу знаний!** 🚀

