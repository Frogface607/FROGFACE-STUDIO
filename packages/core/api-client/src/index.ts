/**
 * Клиент для работы с OpenRouter API
 */

export interface LLMOptions {
  model?: string
  temperature?: number
  max_tokens?: number
}

const DEFAULT_MODEL = 'openai/gpt-4-turbo-preview'
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * Получить API ключ из переменных окружения
 */
function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) {
    throw new Error('OPENROUTER_API_KEY не установлен в переменных окружения')
  }
  return key
}

/**
 * Вызов LLM через OpenRouter
 */
export async function callLLM(
  prompt: string,
  options: LLMOptions = {}
): Promise<string> {
  const apiKey = getApiKey()
  const model = options.model || DEFAULT_MODEL
  const temperature = options.temperature ?? 0.7
  const maxTokens = options.max_tokens ?? 2000

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://frogface.studio',
      'X-Title': 'Frogface Studio',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`)
  }

  const data = await response.json() as {
    choices?: Array<{
      message?: {
        content?: string
      }
    }>
  }
  return data.choices?.[0]?.message?.content || ''
}

/**
 * Список доступных моделей (можно расширить)
 */
export const AVAILABLE_MODELS = {
  GPT4: 'openai/gpt-4-turbo-preview',
  GPT35: 'openai/gpt-3.5-turbo',
  CLAUDE_3_OPUS: 'anthropic/claude-3-opus',
  CLAUDE_3_SONNET: 'anthropic/claude-3-sonnet',
  CLAUDE_3_HAIKU: 'anthropic/claude-3-haiku',
} as const

