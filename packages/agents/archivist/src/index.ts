import { BaseAgent, Task, AgentResponse } from '@frogface/core-agent-base'
import {
  addToKnowledgeBase,
  loadFromTextFile,
  loadFromJSONFile,
} from '@frogface/core-knowledge-base'
import { processFile } from './file-handlers'
import * as path from 'path'

/**
 * Агент-архивариус
 * 
 * Умно организует информацию:
 * - Анализирует контент через LLM
 * - Определяет к какому namespace относится
 * - Добавляет метаданные и теги
 * - Сохраняет в правильное место в RAG
 * - Может загружать файлы
 */
export class ArchivistAgent extends BaseAgent {
  name = 'archivist'
  description = 'Умный архивариус: анализирует и организует информацию в базе знаний'
  knowledgeNamespace = 'archivist'

  // Доступные namespace для классификации
  private availableNamespaces = [
    'copywriter',
    'researcher',
    'smm',
    'psychologist',
    'archivist',
    'global',
  ]

  async execute(task: Task): Promise<AgentResponse> {
    const { prompt, context } = task

    // Определяем тип операции
    const operation = context?.operation as string || 'analyze_and_store'

    switch (operation) {
      case 'analyze_and_store':
        return this.analyzeAndStore(prompt, context)
      
      case 'classify_content':
        return this.classifyContent(prompt, context)
      
      case 'bulk_import':
        return this.bulkImport(context)
      
      case 'file_upload':
        return this.handleFileUpload(context)
      
      default:
        return this.analyzeAndStore(prompt, context)
    }
  }

  getCapabilities(): string[] {
    return [
      'analyze_and_store',
      'classify_content',
      'file_upload',
      'bulk_import',
      'smart_organization',
      'metadata_extraction',
    ]
  }

  /**
   * Проанализировать контент и сохранить в нужное место
   */
  private async analyzeAndStore(
    content: string,
    context?: Record<string, unknown>
  ): Promise<AgentResponse> {
    try {
      // Шаг 1: Классифицируем контент
      const classification = await this.classifyContentInternal(content)
      
      // Шаг 2: Извлекаем метаданные
      const metadata = await this.extractMetadata(content, classification)
      
      // Шаг 3: Определяем лучший namespace
      const targetNamespace = classification.namespace || 'global'
      
      // Шаг 4: Сохраняем в базу знаний
      const id = await addToKnowledgeBase(
        content,
        targetNamespace,
        {
          ...metadata,
          archivedBy: 'archivist',
          archivedAt: new Date().toISOString(),
          confidence: classification.confidence,
        }
      )

      // Шаг 5: Создаем резюме
      const summary = await this.createSummary(content, classification, metadata)

      return {
        result: `✅ Информация успешно заархивирована!

📁 Namespace: ${targetNamespace}
🏷️  Категория: ${classification.category}
📝 Теги: ${metadata.tags?.join(', ') || 'нет'}
📊 Уверенность: ${Math.round(classification.confidence * 100)}%
🆔 ID: ${id}

${summary}`,
        metadata: {
          id,
          namespace: targetNamespace,
          classification,
          metadata,
        },
      }
    } catch (error) {
      throw new Error(
        `Ошибка архивации: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Классифицировать контент (определить namespace и категорию)
   */
  private async classifyContentInternal(content: string): Promise<{
    namespace: string
    category: string
    confidence: number
    reasoning: string
  }> {
    const prompt = `Проанализируй этот контент и определи:
1. К какому типу относится (текст для соцсетей, исследование, дневниковая запись, общая информация и т.д.)
2. К какому namespace в базе знаний лучше отнести
3. Категорию/тег

Доступные namespace: ${this.availableNamespaces.join(', ')}

Контент:
"""
${content.substring(0, 2000)}
"""

Верни ответ в формате JSON:
{
  "namespace": "copywriter|researcher|smm|psychologist|archivist|global",
  "category": "краткое описание категории",
  "confidence": 0.0-1.0,
  "reasoning": "краткое объяснение"
}`

    const response = await this.callLLM(prompt, undefined, 0.3)
    
    try {
      // Извлекаем JSON из ответа
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          namespace: parsed.namespace || 'global',
          category: parsed.category || 'uncategorized',
          confidence: parsed.confidence || 0.5,
          reasoning: parsed.reasoning || '',
        }
      }
    } catch (error) {
      console.warn('Не удалось распарсить классификацию, используем defaults:', error)
    }

    // Fallback: простая эвристика
    return this.fallbackClassification(content)
  }

  /**
   * Fallback классификация на основе ключевых слов
   */
  private fallbackClassification(content: string): {
    namespace: string
    category: string
    confidence: number
    reasoning: string
  } {
    const lower = content.toLowerCase()

    if (lower.includes('пост') || lower.includes('анонс') || lower.includes('соцсети')) {
      return {
        namespace: 'copywriter',
        category: 'social_media',
        confidence: 0.7,
        reasoning: 'Определено по ключевым словам: пост, анонс',
      }
    }

    if (lower.includes('исследован') || lower.includes('анализ') || lower.includes('тренд')) {
      return {
        namespace: 'researcher',
        category: 'research',
        confidence: 0.7,
        reasoning: 'Определено по ключевым словам: исследование, анализ',
      }
    }

    if (lower.includes('эмоц') || lower.includes('чувств') || lower.includes('дневник')) {
      return {
        namespace: 'psychologist',
        category: 'emotional',
        confidence: 0.7,
        reasoning: 'Определено по ключевым словам: эмоции, дневник',
      }
    }

    return {
      namespace: 'global',
      category: 'general',
      confidence: 0.5,
      reasoning: 'Не удалось точно классифицировать, сохранено в global',
    }
  }

  /**
   * Извлечь метаданные из контента
   */
  private async extractMetadata(
    content: string,
    classification: { namespace: string; category: string }
  ): Promise<Record<string, unknown>> {
    const prompt = `Извлеки метаданные из этого контента:

Контент:
"""
${content.substring(0, 1500)}
"""

Извлеки:
- Ключевые теги (5-10 слов)
- Основная тема
- Дата (если упоминается)
- Люди/проекты (если упоминаются)

Верни JSON:
{
  "tags": ["тег1", "тег2"],
  "topic": "основная тема",
  "date": "дата если есть",
  "entities": ["сущность1", "сущность2"]
}`

    try {
      const response = await this.callLLM(prompt, undefined, 0.3)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          tags: parsed.tags || [],
          topic: parsed.topic || classification.category,
          date: parsed.date || null,
          entities: parsed.entities || [],
        }
      }
    } catch (error) {
      console.warn('Ошибка извлечения метаданных:', error)
    }

    return {
      tags: [],
      topic: classification.category,
    }
  }

  /**
   * Создать резюме архивированного контента
   */
  private async createSummary(
    content: string,
    classification: { namespace: string; category: string },
    metadata: Record<string, unknown>
  ): Promise<string> {
    return `📄 Резюме:
${content.length > 200 ? content.substring(0, 200) + '...' : content}

🏷️ Категория: ${classification.category}
📌 Теги: ${(metadata.tags as string[])?.slice(0, 5).join(', ') || 'нет'}`
  }

  /**
   * Публичный метод классификации
   */
  private async classifyContent(
    content: string,
    context?: Record<string, unknown>
  ): Promise<AgentResponse> {
    const classification = await this.classifyContentInternal(content)
    const metadata = await this.extractMetadata(content, classification)

    return {
      result: `Классификация контента:

📁 Предложенный namespace: ${classification.namespace}
🏷️  Категория: ${classification.category}
📊 Уверенность: ${Math.round(classification.confidence * 100)}%
💭 Обоснование: ${classification.reasoning}
📌 Теги: ${(metadata.tags as string[])?.join(', ') || 'нет'}`,
      metadata: {
        classification,
        metadata,
      },
    }
  }

  /**
   * Массовый импорт
   */
  private async bulkImport(context?: Record<string, unknown>): Promise<AgentResponse> {
    const items = context?.items as Array<{ content: string; metadata?: Record<string, unknown> }> || []

    if (items.length === 0) {
      return {
        result: '❌ Нет элементов для импорта',
      }
    }

    const results: Array<{ id: string; namespace: string }> = []

    for (const item of items) {
      try {
        const classification = await this.classifyContentInternal(item.content)
        const id = await addToKnowledgeBase(
          item.content,
          classification.namespace,
          {
            ...item.metadata,
            archivedBy: 'archivist',
            bulkImport: true,
          }
        )
        results.push({ id, namespace: classification.namespace })
      } catch (error) {
        console.error('Ошибка при импорте элемента:', error)
      }
    }

    return {
      result: `✅ Успешно импортировано ${results.length} из ${items.length} элементов`,
      metadata: { results },
    }
  }

  /**
   * Обработка загрузки файла
   */
  private async handleFileUpload(context?: Record<string, unknown>): Promise<AgentResponse> {
    const filePath = context?.filePath as string
    const content = context?.content as string
    const fileName = context?.fileName as string

    if (!filePath && !content) {
      return {
        result: '❌ Необходим filePath или content',
      }
    }

    // Если есть filePath, читаем и обрабатываем файл
    let fileContent = content
    if (filePath && !fileContent) {
      try {
        const fs = await import('fs/promises')
        const buffer = await fs.readFile(filePath)
        fileContent = await processFile(fileName || path.basename(filePath), buffer)
      } catch (error) {
        return {
          result: `❌ Ошибка чтения файла: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }
      }
    } else if (filePath && fileContent) {
      // Если есть и путь и контент, обрабатываем контент через processFile
      try {
        const buffer = Buffer.from(fileContent, 'utf-8')
        fileContent = await processFile(fileName || path.basename(filePath), buffer)
      } catch {
        // Если не получилось, оставляем как есть
      }
    }

    if (!fileContent) {
      return {
        result: '❌ Не удалось получить содержимое файла',
      }
    }

    // Классифицируем и сохраняем
    const classification = await this.classifyContentInternal(fileContent)
    const metadata = await this.extractMetadata(fileContent, classification)

    const id = await addToKnowledgeBase(
      fileContent,
      classification.namespace,
      {
        ...metadata,
        source: filePath || 'upload',
        fileName: fileName || 'unknown',
        archivedBy: 'archivist',
        fileUpload: true,
      }
    )

    return {
      result: `✅ Файл успешно заархивирован!

📁 Namespace: ${classification.namespace}
📄 Файл: ${fileName || filePath || 'upload'}
🆔 ID: ${id}`,
      metadata: {
        id,
        namespace: classification.namespace,
        fileName: fileName || filePath,
      },
    }
  }
}

