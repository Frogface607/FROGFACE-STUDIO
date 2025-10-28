# ⚡ Быстрый старт Supabase

## 🚨 Проблема: Markdown в SQL Editor

SQL Editor в Supabase не понимает markdown разметку (````sql`). Нужен **чистый SQL**!

## ✅ Решение

### Вариант 1: Используй файл `supabase-sql.sql`

Я создал файл `supabase-sql.sql` с чистым SQL (без markdown).

**Что делать:**

1. Открой `supabase-sql.sql` в своем редакторе (Cursor)
2. **Скопируй ВЕСЬ SQL** (Ctrl+A, Ctrl+C)
3. В Supabase SQL Editor → **вставь чистый SQL** (без ````sql` и ````)
4. Нажми **Run** (или Ctrl+Enter)

### Вариант 2: Скопируй SQL прямо здесь

**ШАГ 1: Включить расширение:**

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

**Выполни это отдельно** и проверь что ошибок нет. Должно быть `Success. No rows returned`.

---

**ШАГ 2: Создать таблицу:**

```sql
CREATE TABLE IF NOT EXISTS knowledge_items (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  namespace TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

Выполни это отдельно.

---

**ШАГ 3: Создать индексы:**

```sql
CREATE INDEX IF NOT EXISTS idx_knowledge_namespace ON knowledge_items(namespace);
```

Выполни это отдельно.

---

**ШАГ 4: Включить RLS:**

```sql
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for service role"
ON knowledge_items
FOR ALL
USING (true)
WITH CHECK (true);
```

Выполни это отдельно.

---

## 📋 Проверка

После выполнения всех SQL, проверь:

1. В Supabase Dashboard → **Table Editor**
2. Должна появиться таблица `knowledge_items`
3. Структура: `id`, `content`, `namespace`, `embedding`, `metadata`, `created_at`

## ⚠️ Важно

**НЕ КОПИРУЙ markdown блоки** (````sql` и ````) — только чистый SQL!

Если используешь Quickstart в Supabase — там могут быть шаблоны, но для нашей задачи лучше использовать SQL из `supabase-sql.sql`.

---

**Попробуй сейчас с чистым SQL из `supabase-sql.sql`!** 🚀

