import { callLLM } from '../../api-client/src/index'
import { queryKnowledgeBase } from '../../knowledge-base/src/index'

/**
 * Тип задачи для агента
 */
export interface Task {
  id: string
  prompt: string
  context?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

/**
 * Ответ агента
 */
export interface AgentResponse {
  result: string
  metadata?: Record<string, unknown>
  sources?: string[]
}

/**
 * Результат поиска в базе знаний
 */
export interface KnowledgeResult {
  content: string
  similarity: number
  source?: string
}

/**
 * Базовый абстрактный класс для всех агентов
 * 
 * Каждый агент должен:
 * 1. Наследоваться от этого класса
 * 2. Реализовать метод execute()
 * 3. Определить getCapabilities()
 */
export abstract class BaseAgent {
  abstract name: string
  abstract description: string
  abstract knowledgeNamespace: string

  /**
   * Выполнить задачу агентом
   */
  abstract execute(task: Task): Promise<AgentResponse>

  /**
   * Получить список возможностей агента
   */
  abstract getCapabilities(): string[]

  /**
   * Поиск в базе знаний (RAG)
   */
  protected async queryKnowledge(
    query: string,
    limit = 5
  ): Promise<KnowledgeResult[]> {
    return queryKnowledgeBase(query, this.knowledgeNamespace, limit)
  }

  /**
   * Вызов LLM через OpenRouter
   */
  protected async callLLM(
    prompt: string,
    model?: string,
    temperature = 0.7
  ): Promise<string> {
    return callLLM(prompt, { model, temperature })
  }

  /**
   * Создать промпт с контекстом из базы знаний
   */
  protected async createEnhancedPrompt(
    userPrompt: string,
    contextLimit = 3
  ): Promise<string> {
    const knowledge = await this.queryKnowledge(userPrompt, contextLimit)

    let prompt = `${userPrompt}\n\n`

    if (knowledge.length > 0) {
      prompt += 'Релевантный контекст из базы знаний:\n'
      knowledge.forEach((item, idx) => {
        prompt += `${idx + 1}. ${item.content}\n`
      })
      prompt += '\n'
    }

    prompt += `Используй предоставленный контекст для более точного ответа.`

    return prompt
  }

  /**
   * Получить информацию об агенте
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      capabilities: this.getCapabilities(),
      knowledgeNamespace: this.knowledgeNamespace,
    }
  }
}

