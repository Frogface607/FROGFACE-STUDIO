# 🔧 Настройка Supabase для базы знаний

## 📋 Шаг 1: Создать проект Supabase

1. Зайди на https://supabase.com
2. Sign Up / Login
3. "New Project"
4. Заполни:
   - **Name:** `frogface-studio`
   - **Database Password:** (сохрани его!)
   - **Region:** ближайший к тебе (например, `Europe West`)
5. Нажми "Create new project"
6. Подожди 2-3 минуты пока создается

## 📋 Шаг 2: Настроить базу данных

### 2.1 Включить расширение pgvector

1. В Supabase Dashboard → **SQL Editor**
2. Создай новый запрос
3. Выполни:

```sql
-- Включить расширение для векторного поиска
CREATE EXTENSION IF NOT EXISTS vector;
```

4. Нажми "Run"

### 2.2 Создать таблицу knowledge_items

В том же SQL Editor выполни:

```sql
-- Создать таблицу для базы знаний
CREATE TABLE IF NOT EXISTS knowledge_items (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  namespace TEXT NOT NULL,
  embedding vector(1536), -- OpenAI embedding размер (можно изменить)
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Индекс для быстрого поиска по namespace
CREATE INDEX IF NOT EXISTS idx_knowledge_namespace ON knowledge_items(namespace);

-- Индекс для векторного поиска (создается только если есть embedding)
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding 
ON knowledge_items USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### 2.3 Настроить Row Level Security (RLS)

```sql
-- Включить RLS
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;

-- Политика: Service Key может все
CREATE POLICY "Service key can do everything"
ON knowledge_items
FOR ALL
USING (true)
WITH CHECK (true);
```

## 📋 Шаг 3: Получить ключи API

1. В Dashboard → **Settings** → **API**
2. Найди:
   - **Project URL** → скопируй (нужен для `SUPABASE_URL`)
   - **service_role key** → скопируй (нужен для `SUPABASE_SERVICE_KEY`)
   - **anon public key** → скопируй (опционально для frontend)

## 📋 Шаг 4: Настроить Environment Variables

### Для Railway (Backend):

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Для локальной разработки (.env.local):

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ Проверка

После настройки можно проверить что всё работает:

```typescript
import { SupabaseKnowledgeAdapter } from '@frogface/core-knowledge-base'

const adapter = new SupabaseKnowledgeAdapter({
  url: process.env.SUPABASE_URL!,
  serviceKey: process.env.SUPABASE_SERVICE_KEY!,
})

// Проверить подключение
const isConnected = await adapter.ping()
console.log('Supabase connected:', isConnected)

// Добавить тестовый элемент
const id = await adapter.add(
  'Тестовый контент',
  'copywriter',
  { test: true }
)
console.log('Added ID:', id)
```

## 🎯 Следующие шаги

После настройки Supabase:

1. ✅ Обновить `knowledge-base` для использования Supabase
2. ✅ Мигрировать существующие данные (если есть)
3. ✅ Протестировать на локальной машине
4. ✅ Деплоить на Railway
5. ✅ Протестировать в production

---

**После этой настройки база знаний будет персистентной и надежной!** 🚀

