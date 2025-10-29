import { BaseAgent, Task, AgentResponse } from '../../../core/agent-base/src/index'
import { queryKnowledgeBase } from '../../../core/knowledge-base/src/index'
import { callLLM, AVAILABLE_MODELS } from '../../../core/api-client/src/index'

/**
 * Специальный копирайтер для Edison Craft
 * Пишет в стиле Edison Bar на основе базы знаний со стилями и эталонами
 */
export class EdisonCopywriterAgent extends BaseAgent {
  name = 'edison-copywriter'
  description = 'Копирайтер для Edison Bar: пишет посты и анонсы в фирменном стиле на основе эталонов'
  knowledgeNamespace = 'copywriter' // Основной namespace, но также ищет в smm

  async execute(task: Task): Promise<AgentResponse> {
    const { prompt, context } = task

    // Ищем примеры стиля в обоих namespace
    const edisonStyle = await this.getEdisonStyle(prompt)
    
    // Создаем промпт специально для Edison стиля
    const systemPrompt = this.createEdisonPrompt(edisonStyle, context)
    
    const fullPrompt = `${systemPrompt}\n\nЗапрос пользователя: ${prompt}`

    try {
      // Используем Claude Sonnet
      const result = await this.callLLM(
        fullPrompt,
        AVAILABLE_MODELS.CLAUDE_3_SONNET,
        0.8
      )

      return {
        result,
        metadata: {
          model: 'claude-3-sonnet',
          style: 'edison-craft',
          timestamp: new Date().toISOString(),
          knowledgeUsed: edisonStyle.length,
        },
        sources: ['knowledge_base', 'edison_style_guide'],
      }
    } catch (error) {
      throw new Error(`Ошибка при генерации текста: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Получить стиль Edison из базы знаний
   */
  private async getEdisonStyle(query: string) {
    // Ищем в обоих namespace: copywriter и smm
    const [copywriterResults, smmResults] = await Promise.all([
      queryKnowledgeBase(query, 'copywriter', 3),
      queryKnowledgeBase(query, 'smm', 5), // Больше из smm, там эталоны
    ])

    // Объединяем результаты, приоритет smm (там эталоны)
    const allResults = [...smmResults, ...copywriterResults]
    
    return allResults
  }

  /**
   * Создать промпт для Claude в стиле Edison
   */
  private createEdisonPrompt(
    styleExamples: Array<{ content: string; similarity?: number }>,
    context?: Record<string, unknown>
  ): string {
    const eventType = context?.eventType as string || 'общее'
    const artist = context?.artist as string || ''
    const date = context?.date as string || ''
    const specialNotes = context?.notes as string || ''

    let prompt = `Ты профессиональный копирайтер для EDISON BAR. Твоя задача - создавать посты и анонсы в точном фирменном стиле Edison Bar.

📋 ОСНОВНЫЕ ПРИНЦИПЫ СТИЛЯ EDISON:

1. **Обязательные элементы каждого поста:**
   - 📅 Дата: {ДД.ММ} (например, 24.09)
   - 🕗 Сбор/Начало: время
   - 🎟 Вход: цена или "свободный"
   - В конце: "Бронь столов: edisonbar.ru" (обязательно!)

2. **Фразы-фишки стиля:**
   - "Скорее бронируй стол на сайте edisonbar.ru и приходи!"
   - "Будет огненно!" / "Не пропусти!"
   - "Зови друзей" / "Собирай компанию друзей"
   - Для концертов: "Сбор: 21:00" (не "Начало")
   - Для джемов: "Сбор: 20:00", "Вход: свободный"

3. **Эмодзи блок:**
   Обязательно используй такой формат:
   📅 Дата: {дата}
   🕗 Сбор: {время}
   🎟 Вход: {цена}

4. **Тональность:**
   - Дружелюбная, но не панибратская
   - Энергичная для концертов
   - Ламповая для джемов
   - С эмодзи умеренно (1-2 в основном тексте, больше в блоке с датой)

5. **Структура:**
   - Заголовок: {ДАТА} | {АРТИСТ/СОБЫТИЕ} | EDISON BAR
   - Основной текст (3-5 предложений)
   - Эмодзи блок с датой/временем/ценой
   - "Бронь столов: edisonbar.ru"

`

    // Добавляем примеры из базы знаний
    if (styleExamples.length > 0) {
      prompt += `\n📚 РЕЛЕВАНТНЫЕ ЭТАЛОНЫ И ПРИМЕРЫ ИЗ БАЗЫ ЗНАНИЙ:\n\n`
      
      styleExamples.forEach((example, idx) => {
        // Ограничиваем длину примера
        const content = example.content.length > 1500 
          ? example.content.substring(0, 1500) + '...'
          : example.content
        
        prompt += `Пример ${idx + 1}:\n${content}\n\n---\n\n`
      })

      prompt += `⚠️ ВАЖНО: Используй эти примеры как ТОЧНЫЙ ориентир стиля. Следуй структуре, фразам и формату, но адаптируй под текущий запрос.\n\n`
    }

    // Добавляем контекст задачи
    if (eventType || artist || date) {
      prompt += `\n📌 КОНТЕКСТ ЗАДАЧИ:\n`
      if (eventType) prompt += `Тип события: ${eventType}\n`
      if (artist) prompt += `Артист/Группа: ${artist}\n`
      if (date) prompt += `Дата: ${date}\n`
      if (specialNotes) prompt += `Особые пожелания: ${specialNotes}\n`
    }

    prompt += `\n🎯 ЗАДАЧА: Создай пост/анонс в точном стиле Edison Bar, следуя всем примерам и принципам выше. ВЕРНИ ТОЛЬКО ГОТОВЫЙ ТЕКСТ ПОСТА, без дополнительных объяснений.`

    return prompt
  }

  getCapabilities(): string[] {
    return [
      'generate_edison_post',
      'generate_event_announcement',
      'generate_jazz_jam_post',
      'generate_concert_announcement',
      'adapt_to_edison_style',
      'generate_birthday_post',
    ]
  }
}

