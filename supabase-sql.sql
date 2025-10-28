-- ==========================================
-- ШАГ 1: Включить расширение pgvector
-- ==========================================
CREATE EXTENSION IF NOT EXISTS vector;

-- ==========================================
-- ШАГ 2: Создать таблицу knowledge_items
-- ==========================================
CREATE TABLE IF NOT EXISTS knowledge_items (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  namespace TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- ШАГ 3: Создать индексы для быстрого поиска
-- ==========================================

-- Индекс для поиска по namespace
CREATE INDEX IF NOT EXISTS idx_knowledge_namespace ON knowledge_items(namespace);

-- Индекс для векторного поиска (только если есть embeddings)
-- Этот индекс может быть создан позже, когда начнем использовать embeddings
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding 
ON knowledge_items USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ==========================================
-- ШАГ 4: Настроить Row Level Security (RLS)
-- ==========================================

-- Включить RLS
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;

-- Политика: Service Key может все (для backend)
-- Создадим политику которая разрешает все операции через service_role
-- Service key автоматически обходит RLS, так что эта политика для anon key
CREATE POLICY "Enable all operations for service role"
ON knowledge_items
FOR ALL
USING (true)
WITH CHECK (true);

