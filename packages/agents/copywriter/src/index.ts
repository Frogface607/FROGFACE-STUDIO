import { BaseAgent, Task, AgentResponse } from '../../../core/agent-base/src/index'

/**
 * Агент-копирайтер
 * Специализируется на создании текстового контента:
 * - Посты для соцсетей
 * - Анонсы концертов и событий
 * - Адаптация текстов под разные платформы
 * - Работа с разными тональностями
 */
export class CopywriterAgent extends BaseAgent {
  name = 'copywriter'
  description = 'Генерирует текстовый контент для соцсетей, анонсы, посты'
  knowledgeNamespace = 'copywriter'

  async execute(task: Task): Promise<AgentResponse> {
    const { prompt, context } = task

    // Определяем тип задачи из контекста
    const taskType = context?.type as string || 'generic'
    
    // Создаем промпт с учетом контекста из базы знаний
    const enhancedPrompt = await this.createEnhancedPrompt(prompt, 3)

    let systemPrompt = ''

    switch (taskType) {
      case 'post':
        systemPrompt = this.getPostPrompt(context)
        break
      case 'announcement':
        systemPrompt = this.getAnnouncementPrompt(context)
        break
      case 'adapter':
        systemPrompt = this.getAdapterPrompt(context)
        break
      default:
        systemPrompt = this.getGenericPrompt(context)
    }

    const fullPrompt = `${systemPrompt}\n\nЗапрос пользователя: ${enhancedPrompt}`

    try {
      const result = await this.callLLM(fullPrompt, undefined, 0.8)
      
      // Сохраняем результат в базу знаний для будущего использования
      // await addToKnowledgeBase(result, this.knowledgeNamespace, { taskType })

      return {
        result,
        metadata: {
          taskType,
          model: 'gpt-4-turbo',
          timestamp: new Date().toISOString(),
        },
        sources: ['knowledge_base', 'llm'],
      }
    } catch (error) {
      throw new Error(`Ошибка при генерации текста: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  getCapabilities(): string[] {
    return [
      'generate_post',
      'generate_announcement',
      'adapt_text',
      'generate_caption',
      'create_copy',
    ]
  }

  /**
   * Промпт для создания постов
   */
  private getPostPrompt(context?: Record<string, unknown>): string {
    const tone = context?.tone || 'дружелюбный'
    const length = context?.length || 'средний'
    const platform = context?.platform || 'универсальный'

    return `Ты профессиональный копирайтер для соцсетей. 

Создай ${length} пост для ${platform} платформы.
Тон: ${tone}.
Стиль: живой, вовлекающий, с эмодзи где уместно.
Не используй хештеги, если не указано иначе.

Верни только готовый текст поста.`
  }

  /**
   * Промпт для анонсов
   */
  private getAnnouncementPrompt(context?: Record<string, unknown>): string {
    const event = context?.event || 'событие'
    const date = context?.date || ''
    const location = context?.location || ''

    return `Создай анонс для ${event}.
${date ? `Дата: ${date}` : ''}
${location ? `Место: ${location}` : ''}

Сделай его захватывающим, информативным и мотивирующим посетить событие.
Включи всю ключевую информацию: что, когда, где, почему стоит прийти.
Стиль: энергичный, но профессиональный.`
  }

  /**
   * Промпт для адаптации текста
   */
  private getAdapterPrompt(context?: Record<string, unknown>): string {
    const targetPlatform = context?.targetPlatform || 'платформу'
    const originalText = context?.originalText || ''

    return `Адаптируй этот текст для ${targetPlatform}:

"${originalText}"

Учти особенности платформы:
- Длину поста
- Стиль общения
- Использование эмодзи
- Форматирование
- Аудиторию

Верни только адаптированный текст.`
  }

  /**
   * Универсальный промпт
   */
  private getGenericPrompt(context?: Record<string, unknown>): string {
    return `Ты профессиональный копирайтер. Создай качественный текст на основе запроса пользователя.

Требования:
- Оригинальность
- Читабельность
- Соответствие целям
- Привлекательность для целевой аудитории`
  }
}

