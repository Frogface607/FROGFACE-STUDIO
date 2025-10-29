import { callLLM } from '../../api-client/src/index'
import { SupabaseKnowledgeAdapter } from './supabase-adapter'

/**
 * Результат поиска в базе знаний
 */
export interface KnowledgeResult {
  content: string
  similarity: number
  source?: string
  metadata?: Record<string, unknown>
}

/**
 * Тип хранилища для базы знаний
 * Используем Supabase в продакшене, in-memory для разработки
 */
interface KnowledgeItem {
  id: string
  content: string
  namespace: string
  embedding?: number[]
  metadata?: Record<string, unknown>
  createdAt: Date
}

// In-memory хранилище (fallback если Supabase не настроен)
const knowledgeStore: Map<string, KnowledgeItem> = new Map()

// Инициализация Supabase адаптера (если переменные окружения настроены)
let supabaseAdapter: SupabaseKnowledgeAdapter | null = null

function initSupabase(): SupabaseKnowledgeAdapter | null {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (url && serviceKey) {
    try {
      return new SupabaseKnowledgeAdapter({ url, serviceKey })
    } catch (error) {
      console.warn('⚠️ Не удалось инициализировать Supabase, используем in-memory хранилище:', error)
      return null
    }
  }
  
  return null
}

// Инициализируем при первом использовании
function getAdapter(): SupabaseKnowledgeAdapter | null {
  if (!supabaseAdapter) {
    supabaseAdapter = initSupabase()
  }
  return supabaseAdapter
}

/**
 * Добавить документ в базу знаний
 */
export async function addToKnowledgeBase(
  content: string,
  namespace: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  const adapter = getAdapter()

  // Используем Supabase если доступен
  if (adapter) {
    try {
      const id = await adapter.add(content, namespace, metadata)
      console.log(`✅ Добавлено в Supabase (${namespace}): ${content.substring(0, 50)}...`)
      return id
    } catch (error) {
      console.warn('⚠️ Ошибка при сохранении в Supabase, используем in-memory:', error)
      // Fallback на in-memory
    }
  }

  // Fallback: in-memory хранилище
  const id = `${namespace}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const item: KnowledgeItem = {
    id,
    content,
    namespace,
    metadata,
    createdAt: new Date(),
  }
  knowledgeStore.set(id, item)
  console.log(`✅ Добавлено в in-memory (${namespace}): ${content.substring(0, 50)}...`)
  return id
}

/**
 * Поиск в базе знаний с использованием RAG
 */
export async function queryKnowledgeBase(
  query: string,
  namespace: string,
  limit = 5
): Promise<KnowledgeResult[]> {
  const adapter = getAdapter()

  // Используем Supabase если доступен
  if (adapter) {
    try {
      const results = await adapter.search(query, namespace, limit)
      return results.map((r) => ({
        content: r.content,
        similarity: r.similarity,
        source: r.metadata?.id as string | undefined,
        metadata: r.metadata,
      }))
    } catch (error) {
      console.warn('⚠️ Ошибка при поиске в Supabase, используем in-memory:', error)
      // Fallback на in-memory
    }
  }

  // Fallback: in-memory поиск
  const queryLower = query.toLowerCase()
  const items: KnowledgeItem[] = []

  for (const item of knowledgeStore.values()) {
    if (item.namespace === namespace) {
      const contentLower = item.content.toLowerCase()
      if (contentLower.includes(queryLower)) {
        items.push(item)
      }
    }
  }

  items.sort((a, b) => {
    const aScore = a.content.toLowerCase().includes(queryLower) ? 1 : 0
    const bScore = b.content.toLowerCase().includes(queryLower) ? 1 : 0
    return bScore - aScore
  })

  return items.slice(0, limit).map((item) => ({
    content: item.content,
    similarity: 0.8,
    source: item.id,
    metadata: item.metadata,
  }))
}

/**
 * Улучшить запрос с помощью LLM перед поиском
 */
export async function enhancedKnowledgeQuery(
  query: string,
  namespace: string,
  limit = 5
): Promise<KnowledgeResult[]> {
  // Используем LLM для улучшения запроса
  const enhancedPrompt = `Переформулируй этот запрос для поиска в базе знаний, сохраняя смысл: "${query}"`
  
  try {
    const enhancedQuery = await callLLM(enhancedPrompt, { temperature: 0.3 })
    return queryKnowledgeBase(enhancedQuery, namespace, limit)
  } catch (error) {
    // Если не получилось улучшить, используем исходный запрос
    console.warn('Failed to enhance query, using original:', error)
    return queryKnowledgeBase(query, namespace, limit)
  }
}

/**
 * Получить все документы из namespace
 */
export async function getAllFromNamespace(namespace: string): Promise<KnowledgeResult[]> {
  const adapter = getAdapter()

  // Используем Supabase если доступен
  if (adapter) {
    try {
      const items = await adapter.getAll(namespace)
      return items.map((item) => ({
        content: item.content,
        similarity: 1.0,
        source: item.id,
        metadata: item.metadata as Record<string, unknown> | undefined,
      }))
    } catch (error) {
      console.warn('⚠️ Ошибка при получении из Supabase, используем in-memory:', error)
      // Fallback на in-memory
    }
  }

  // Fallback: in-memory
  const items: KnowledgeItem[] = []
  
  for (const item of knowledgeStore.values()) {
    if (item.namespace === namespace) {
      items.push(item)
    }
  }

  return items.map((item) => ({
    content: item.content,
    similarity: 1.0,
    source: item.id,
    metadata: item.metadata,
  }))
}

/**
 * Удалить документ из базы знаний
 */
export function removeFromKnowledgeBase(id: string): boolean {
  return knowledgeStore.delete(id)
}

// Экспортируем для будущего расширения
export { knowledgeStore } // Можно убрать при переходе на реальную БД

// Экспортируем loader и seeder
export * from './loader'
export * from './seeder'
