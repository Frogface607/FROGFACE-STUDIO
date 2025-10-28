import { callLLM } from '@frogface/core-api-client'

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
 * Пока используем in-memory хранилище, потом можно заменить на Firebase/ChromaDB
 */
interface KnowledgeItem {
  id: string
  content: string
  namespace: string
  embedding?: number[]
  metadata?: Record<string, unknown>
  createdAt: Date
}

// In-memory хранилище (заменить на реальную БД позже)
const knowledgeStore: Map<string, KnowledgeItem> = new Map()

/**
 * Добавить документ в базу знаний
 */
export async function addToKnowledgeBase(
  content: string,
  namespace: string,
  metadata?: Record<string, unknown>
): Promise<string> {
  const id = `${namespace}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const item: KnowledgeItem = {
    id,
    content,
    namespace,
    metadata,
    createdAt: new Date(),
  }

  knowledgeStore.set(id, item)
  console.log(`✅ Добавлено в базу знаний (${namespace}): ${content.substring(0, 50)}...`)
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
  // Пока используем простой текстовый поиск
  // Позже заменить на семантический поиск с embeddings

  const queryLower = query.toLowerCase()
  const items: KnowledgeItem[] = []

  // Фильтруем по namespace и ищем совпадения
  for (const item of knowledgeStore.values()) {
    if (item.namespace === namespace) {
      const contentLower = item.content.toLowerCase()
      if (contentLower.includes(queryLower)) {
        items.push(item)
      }
    }
  }

  // Сортируем по релевантности (упрощенно)
  items.sort((a, b) => {
    const aScore = a.content.toLowerCase().includes(queryLower) ? 1 : 0
    const bScore = b.content.toLowerCase().includes(queryLower) ? 1 : 0
    return bScore - aScore
  })

  // Берем топ N результатов
  return items.slice(0, limit).map((item) => ({
    content: item.content,
    similarity: 0.8, // Заглушка для similarity score
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
export function getAllFromNamespace(namespace: string): KnowledgeResult[] {
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
