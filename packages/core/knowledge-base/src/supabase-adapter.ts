/**
 * Адаптер для Supabase - облачное хранилище базы знаний
 */

export interface SupabaseConfig {
  url: string
  serviceKey: string
  anonKey?: string
}

export interface KnowledgeItem {
  id: string
  content: string
  namespace: string
  embedding?: number[]
  metadata?: Record<string, unknown>
  created_at: string
}

/**
 * Supabase клиент для базы знаний
 */
export class SupabaseKnowledgeAdapter {
  private supabaseUrl: string
  private serviceKey: string
  private anonKey?: string

  constructor(config: SupabaseConfig) {
    this.supabaseUrl = config.url
    this.serviceKey = config.serviceKey
    this.anonKey = config.anonKey
  }

  /**
   * Создать таблицы в Supabase (миграция)
   * Вызывается один раз при настройке
   */
  async createTables(): Promise<void> {
    // Это будет SQL migration через Supabase dashboard или API
    // Пока просто interface
    console.log('📋 Создай таблицы в Supabase SQL Editor:')
    console.log(`
CREATE TABLE IF NOT EXISTS knowledge_items (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  namespace TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_namespace ON knowledge_items(namespace);
CREATE INDEX IF NOT EXISTS idx_embedding ON knowledge_items USING ivfflat (embedding vector_cosine_ops);
    `)
  }

  /**
   * Добавить документ в базу знаний
   */
  async add(
    content: string,
    namespace: string,
    metadata?: Record<string, unknown>,
    embedding?: number[]
  ): Promise<string> {
    const id = `${namespace}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const item: KnowledgeItem = {
      id,
      content,
      namespace,
      embedding,
      metadata,
      created_at: new Date().toISOString(),
    }

    const response = await fetch(`${this.supabaseUrl}/rest/v1/knowledge_items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.serviceKey,
        'Authorization': `Bearer ${this.serviceKey}`,
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status} - ${await response.text()}`)
    }

    return id
  }

  /**
   * Поиск в базе знаний (пока простой текстовый поиск)
   * TODO: добавить vector search когда будет pgvector
   */
  async search(
    query: string,
    namespace: string,
    limit = 5
  ): Promise<Array<{ content: string; similarity: number; metadata?: Record<string, unknown> }>> {
    // Используем правильное URL encoding для Supabase PostgREST
    const encodedQuery = encodeURIComponent(`%${query}%`)
    const encodedNamespace = encodeURIComponent(namespace)
    
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/knowledge_items?namespace=eq.${encodedNamespace}&content=ilike.${encodedQuery}&limit=${limit}`,
      {
        headers: {
          'apikey': this.serviceKey,
          'Authorization': `Bearer ${this.serviceKey}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Supabase search error: ${response.status} - ${errorText}`)
    }

      const data = await response.json()
      const items = data as KnowledgeItem[]

    return items.map((item) => ({
      content: item.content,
      similarity: 0.8, // Placeholder, в vector search будет реальный similarity
      metadata: { ...item.metadata, id: item.id } as Record<string, unknown>,
    }))
  }

  /**
   * Получить все элементы из namespace
   */
  async getAll(namespace: string): Promise<KnowledgeItem[]> {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/knowledge_items?namespace=eq.${namespace}`,
      {
        headers: {
          'apikey': this.serviceKey,
          'Authorization': `Bearer ${this.serviceKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Supabase get all error: ${response.status}`)
    }

    const data = await response.json()
    return data as KnowledgeItem[]
  }

  /**
   * Удалить элемент
   */
  async remove(id: string): Promise<void> {
    const response = await fetch(
      `${this.supabaseUrl}/rest/v1/knowledge_items?id=eq.${id}`,
      {
        method: 'DELETE',
        headers: {
          'apikey': this.serviceKey,
          'Authorization': `Bearer ${this.serviceKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Supabase delete error: ${response.status}`)
    }
  }

  /**
   * Проверить подключение
   */
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.supabaseUrl}/rest/v1/knowledge_items?limit=1`,
        {
          headers: {
            'apikey': this.serviceKey,
            'Authorization': `Bearer ${this.serviceKey}`,
          },
        }
      )
      return response.ok
    } catch {
      return false
    }
  }
}

