/**
 * Загрузчик знаний в базу знаний
 * Поддерживает загрузку из разных источников
 */

import { addToKnowledgeBase } from './index'
import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Загрузить знания из текстового файла
 */
export async function loadFromTextFile(
  filePath: string,
  namespace: string,
  metadata?: Record<string, unknown>
): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    
    // Разбиваем на чанки (по параграфам или по размеру)
    const chunks = splitIntoChunks(content, 1000) // ~1000 символов на чанк
    
    const ids: string[] = []
    
    for (const chunk of chunks) {
      if (chunk.trim().length > 0) {
        const id = await addToKnowledgeBase(chunk, namespace, {
          ...metadata,
          source: filePath,
          chunkIndex: chunks.indexOf(chunk),
        })
        ids.push(id)
      }
    }
    
    console.log(`✅ Загружено ${ids.length} чанков из ${filePath} в namespace "${namespace}"`)
    return ids
  } catch (error) {
    throw new Error(`Ошибка загрузки файла ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Загрузить знания из директории с файлами
 */
export async function loadFromDirectory(
  dirPath: string,
  namespace: string,
  extensions = ['.txt', '.md', '.json']
): Promise<string[]> {
  const allIds: string[] = []
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      
      if (entry.isDirectory()) {
        // Рекурсивно загружаем из поддиректорий
        const subIds = await loadFromDirectory(fullPath, namespace, extensions)
        allIds.push(...subIds)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (extensions.includes(ext)) {
          const ids = await loadFromTextFile(fullPath, namespace, {
            fileName: entry.name,
          })
          allIds.push(...ids)
        }
      }
    }
    
    console.log(`✅ Загружено ${allIds.length} чанков из директории ${dirPath}`)
    return allIds
  } catch (error) {
    throw new Error(`Ошибка загрузки директории ${dirPath}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Загрузить знания из JSON файла
 */
export async function loadFromJSONFile(
  filePath: string,
  namespace: string
): Promise<string[]> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(content)
    
    const ids: string[] = []
    
    // Поддерживаем разные форматы JSON
    if (Array.isArray(data)) {
      // Массив объектов или строк
      for (const item of data) {
        const text = typeof item === 'string' ? item : JSON.stringify(item)
        const id = await addToKnowledgeBase(text, namespace, {
          source: filePath,
          index: data.indexOf(item),
        })
        ids.push(id)
      }
    } else if (typeof data === 'object') {
      // Объект с ключами
      for (const [key, value] of Object.entries(data)) {
        const text = typeof value === 'string' ? value : JSON.stringify(value)
        const id = await addToKnowledgeBase(text, namespace, {
          source: filePath,
          key,
        })
        ids.push(id)
      }
    } else {
      // Просто строка
      const id = await addToKnowledgeBase(String(data), namespace, {
        source: filePath,
      })
      ids.push(id)
    }
    
    console.log(`✅ Загружено ${ids.length} элементов из JSON ${filePath}`)
    return ids
  } catch (error) {
    throw new Error(`Ошибка загрузки JSON ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Разбить текст на чанки
 */
function splitIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = []
  
  // Сначала пытаемся разбить по параграфам
  const paragraphs = text.split(/\n\s*\n/)
  
  let currentChunk = ''
  
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length <= maxChunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph
    } else {
      if (currentChunk) {
        chunks.push(currentChunk)
      }
      
      // Если параграф слишком большой, разбиваем его
      if (paragraph.length > maxChunkSize) {
        const words = paragraph.split(/\s+/)
        let wordChunk = ''
        
        for (const word of words) {
          if (wordChunk.length + word.length + 1 <= maxChunkSize) {
            wordChunk += (wordChunk ? ' ' : '') + word
          } else {
            if (wordChunk) chunks.push(wordChunk)
            wordChunk = word
          }
        }
        
        if (wordChunk) {
          currentChunk = wordChunk
        } else {
          currentChunk = ''
        }
      } else {
        currentChunk = paragraph
      }
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk)
  }
  
  return chunks.length > 0 ? chunks : [text]
}

/**
 * Массовая загрузка знаний
 */
export async function bulkLoadKnowledge(
  sources: Array<{
    type: 'file' | 'directory' | 'json'
    path: string
    namespace: string
    metadata?: Record<string, unknown>
  }>
): Promise<{ [namespace: string]: number }> {
  const results: { [namespace: string]: number } = {}
  
  for (const source of sources) {
    try {
      let ids: string[] = []
      
      switch (source.type) {
        case 'file':
          ids = await loadFromTextFile(source.path, source.namespace, source.metadata)
          break
        case 'directory':
          ids = await loadFromDirectory(source.path, source.namespace)
          break
        case 'json':
          ids = await loadFromJSONFile(source.path, source.namespace)
          break
      }
      
      results[source.namespace] = (results[source.namespace] || 0) + ids.length
    } catch (error) {
      console.error(`❌ Ошибка загрузки ${source.path}:`, error)
    }
  }
  
  return results
}

