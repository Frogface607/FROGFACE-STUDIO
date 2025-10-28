# 💻 Использование CLI Архивариуса

## 🎯 Что такое CLI?

CLI = Command Line Interface (интерфейс командной строки)

Это значит что ты работаешь **через терминал/консоль**, а не через браузер.

## 🚀 Как использовать

### Открой терминал PowerShell

Нажми `Win + X` → выбери "Windows PowerShell" или "Terminal"

### Перейди в папку проекта

```powershell
cd "C:\Users\Sergey\FROGFACE STUDIO"
```

### Выполняй команды

## 📋 Команды

### 1. Добавить текст в базу знаний

```powershell
pnpm tsx scripts/archivist-simple.ts add "Твой текст здесь"
```

**Пример:**
```powershell
pnpm tsx scripts/archivist-simple.ts add "Пример поста про концерт Embers"
```

**Что произойдет:**
- Архивариус проанализирует текст
- Определит namespace (copywriter/researcher/smm и т.д.)
- Сохранит в базу знаний
- Покажет результат

---

### 2. Загрузить файл

```powershell
pnpm tsx scripts/archivist-simple.ts add-file "путь/к/файлу.html"
```

**Примеры:**

```powershell
# HTML файл из Downloads
pnpm tsx scripts/archivist-simple.ts add-file "C:\Users\Sergey\Downloads\мой-файл.html"

# JSON файл
pnpm tsx scripts/archivist-simple.ts add-file "C:\Users\Sergey\Downloads\EDDY EDISON.blueprint.json"

# Текстовый файл
pnpm tsx scripts/archivist-simple.ts add-file "мой-файл.txt"
```

**Что произойдет:**
- Файл прочитается
- Если HTML - распарсится (удалятся теги)
- Проанализируется через AI
- Сохранится в базу знаний

---

### 3. Посмотреть статистику

```powershell
pnpm tsx scripts/archivist-simple.ts stats
```

**Что покажет:**
```
📊 Статистика базы знаний:

smm: 2 записей
researcher: 1 записей
copywriter: 0 записей
```

---

### 4. Список записей

```powershell
# Все записи
pnpm tsx scripts/archivist-simple.ts list

# Записи в конкретном namespace
pnpm tsx scripts/archivist-simple.ts list copywriter
pnpm tsx scripts/archivist-simple.ts list smm
pnpm tsx scripts/archivist-simple.ts list researcher
```

**Что покажет:**
- Список всех записей
- Категорию каждой
- Краткий превью (первые 100 символов)
- ID записи

---

## 💡 Примеры работы

### Пример 1: Загрузить один файл

```powershell
# Найди файл (например в Downloads)
Get-ChildItem "$env:USERPROFILE\Downloads" -Filter "*.html"

# Загрузи его
pnpm tsx scripts/archivist-simple.ts add-file "$env:USERPROFILE\Downloads\мой-файл.html"

# Проверь что сохранилось
pnpm tsx scripts/archivist-simple.ts stats
```

### Пример 2: Добавить несколько текстов

```powershell
# Первый текст
pnpm tsx scripts/archivist-simple.ts add "Пример поста 1"

# Второй текст
pnpm tsx scripts/archivist-simple.ts add "Пример поста 2"

# Третий текст
pnpm tsx scripts/archivist-simple.ts add "Исследование трендов 2024"

# Посмотри статистику
pnpm tsx scripts/archivist-simple.ts stats
```

### Пример 3: Найти свой HTML файл и загрузить

```powershell
# Поиск файлов про Edison
Get-ChildItem "$env:USERPROFILE\Downloads" -Filter "*Edison*" -Recurse

# Загрузить найденный файл
pnpm tsx scripts/archivist-simple.ts add-file "путь/к/найденному/файлу.html"
```

---

## 🎨 Полный рабочий процесс

1. **Загрузи файл:**
   ```powershell
   pnpm tsx scripts/archivist-simple.ts add-file "файл.html"
   ```

2. **Проверь что сохранилось:**
   ```powershell
   pnpm tsx scripts/archivist-simple.ts stats
   ```

3. **Посмотри записи:**
   ```powershell
   pnpm tsx scripts/archivist-simple.ts list copywriter
   ```

4. **Загрузи еще файлы:**
   ```powershell
   pnpm tsx scripts/archivist-simple.ts add-file "другой-файл.txt"
   ```

---

## 💾 Где хранятся данные

Все знания сохраняются в файл:
```
C:\Users\Sergey\FROGFACE STUDIO\knowledge-store.json
```

Этот файл создается автоматически. Все записи сохраняются между запусками!

---

## 🔑 Важно

**Ключ OpenRouter уже встроен в скрипт**, но если нужно установить вручную:

```powershell
$env:OPENROUTER_API_KEY="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"
```

Или создай файл `.env.local` (уже должен существовать).

---

**Просто копируй команды в терминал и выполняй!** 🚀

