#!/usr/bin/env tsx
/**
 * Упрощенная версия архивариуса без workspace зависимостей
 * Работает напрямую с функциями и сохраняет в файл
 */

import * as fs from 'fs/promises'
import * as path from 'path'

const KNOWLEDGE_FILE = path.join(__dirname, '../knowledge-store.json')

// Загружаем знания из файла
let knowledgeStore: Map<string, any> = new Map()

async function loadKnowledge() {
  try {
    const data = await fs.readFile(KNOWLEDGE_FILE, 'utf-8')
    const items = JSON.parse(data)
    knowledgeStore = new Map(Object.entries(items))
  } catch {
    // Файл не существует, начинаем с пустой базы
    knowledgeStore = new Map()
  }
}

async function saveKnowledge() {
  const items = Object.fromEntries(knowledgeStore)
  await fs.writeFile(KNOWLEDGE_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

// Загружаем env
const apiKey = process.env.OPENROUTER_API_KEY || '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'

async function callLLM(prompt: string, temperature = 0.7): Promise<string> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://frogface.studio',
      'X-Title': 'Frogface Studio',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

async function classifyContent(content: string): Promise<{ namespace: string; category: string }> {
  const prompt = `Проанализируй этот контент и определи к какому namespace относится:

Доступные namespace: copywriter, researcher, smm, psychologist, archivist, global

Контент:
"""
${content.substring(0, 2000)}
"""

Верни JSON:
{
  "namespace": "copywriter|researcher|smm|psychologist|archivist|global",
  "category": "краткое описание"
}`

  try {
    const response = await callLLM(prompt, 0.3)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.warn('Ошибка классификации:', error)
  }

  // Fallback
  const lower = content.toLowerCase()
  if (lower.includes('пост') || lower.includes('анонс') || lower.includes('концерт')) {
    return { namespace: 'copywriter', category: 'post' }
  }
  if (lower.includes('исследован') || lower.includes('анализ')) {
    return { namespace: 'researcher', category: 'research' }
  }
  if (lower.includes('стиль') || lower.includes('smm') || lower.includes('соцсет')) {
    return { namespace: 'copywriter', category: 'style' }
  }
  return { namespace: 'global', category: 'general' }
}

function extractTextFromHTML(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  text = text.replace(/<[^>]+>/g, ' ')
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

async function processFile(fileName: string, buffer: Buffer): Promise<string> {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  if (ext === 'html' || ext === 'htm') {
    const htmlText = buffer.toString('utf-8')
    const titleMatch = htmlText.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    const headings: string[] = []
    const headingRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi
    let match
    while ((match = headingRegex.exec(htmlText)) !== null) {
      const heading = match[1].replace(/<[^>]+>/g, '').trim()
      if (heading) headings.push(heading)
    }
    
    const cleanText = extractTextFromHTML(htmlText)
    
    let result = ''
    if (title) result += `# ${title}\n\n`
    if (headings.length > 0) {
      result += '## Заголовки:\n'
      headings.forEach(h => result += `- ${h}\n`)
      result += '\n'
    }
    result += cleanText.substring(0, 10000)
    
    return result
  }
  
  if (ext === 'json') {
    try {
      const json = JSON.parse(buffer.toString('utf-8'))
      return JSON.stringify(json, null, 2)
    } catch {
      return buffer.toString('utf-8')
    }
  }
  
  return buffer.toString('utf-8')
}

async function addToKnowledge(content: string, namespace: string, metadata: any = {}): Promise<string> {
  const id = `${namespace}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  knowledgeStore.set(id, {
    id,
    content,
    namespace,
    metadata,
    createdAt: new Date().toISOString(),
  })
  await saveKnowledge()
  console.log(`✅ Сохранено в ${namespace}: ${id}`)
  return id
}

async function addText(text: string) {
  console.log('📝 Анализирую текст...')
  const classification = await classifyContent(text)
  
  console.log(`✅ Классификация: ${classification.namespace} - ${classification.category}`)
  
  const id = await addToKnowledge(text, classification.namespace, {
    category: classification.category,
    archivedAt: new Date().toISOString(),
    source: 'cli',
  })
  
  console.log(`✅ Сохранено! ID: ${id}`)
  console.log(`📁 Namespace: ${classification.namespace}`)
}

async function addFile(filePath: string) {
  console.log(`📄 Обрабатываю файл: ${filePath}`)
  
  const buffer = await fs.readFile(filePath)
  const fileName = path.basename(filePath)
  const content = await processFile(fileName, buffer)
  
  console.log(`📝 Извлечено ${content.length} символов`)
  
  await addText(content)
}

async function stats() {
  const namespaces: Record<string, number> = {}
  
  // Если используем Supabase, получаем через него
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const { SupabaseKnowledgeAdapter } = require('../packages/core/knowledge-base/src/supabase-adapter')
      const adapter = new SupabaseKnowledgeAdapter({
        url: process.env.SUPABASE_URL,
        serviceKey: process.env.SUPABASE_SERVICE_KEY,
      })
      
      // Получаем все namespace (нужно сделать запрос или использовать metadata)
      const allNamespaces = ['copywriter', 'researcher', 'smm', 'psychologist', 'archivist', 'global', 'test']
      for (const ns of allNamespaces) {
        const items = await adapter.getAll(ns)
        if (items.length > 0) {
          namespaces[ns] = items.length
        }
      }
    } catch (error) {
      console.warn('Ошибка при получении статистики из Supabase:', error)
    }
  }
  
  // Fallback на in-memory
  if (Object.keys(namespaces).length === 0) {
    for (const item of knowledgeStore.values()) {
      namespaces[item.namespace] = (namespaces[item.namespace] || 0) + 1
    }
  }
  
  console.log('📊 Статистика базы знаний:\n')
  if (Object.keys(namespaces).length === 0) {
    console.log('База знаний пуста')
  } else {
    for (const [ns, count] of Object.entries(namespaces)) {
      console.log(`${ns}: ${count} записей`)
    }
  }
}

async function list(ns?: string) {
  const namespace = ns || 'global'
  let items: any[] = []
  
  // Если используем Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
    try {
      const { SupabaseKnowledgeAdapter } = require('../packages/core/knowledge-base/src/supabase-adapter')
      const adapter = new SupabaseKnowledgeAdapter({
        url: process.env.SUPABASE_URL,
        serviceKey: process.env.SUPABASE_SERVICE_KEY,
      })
      const supabaseItems = await adapter.getAll(namespace)
      items = supabaseItems.map((item: any) => ({
        id: item.id,
        content: item.content,
        metadata: item.metadata || {},
      }))
    } catch (error) {
      console.warn('Ошибка при получении из Supabase:', error)
    }
  }
  
  // Fallback на in-memory
  if (items.length === 0) {
    for (const item of knowledgeStore.values()) {
      if (!namespace || item.namespace === namespace) {
        items.push(item)
      }
    }
  }
  
  console.log(`\n📋 Записи в ${namespace}: ${items.length}\n`)
  items.forEach((item, idx) => {
    console.log(`${idx + 1}. [${item.metadata?.category || 'uncategorized'}]`)
    console.log(`   ${item.content.substring(0, 100)}...`)
    console.log(`   ID: ${item.id}\n`)
  })
}

// Main
async function main() {
  // Загружаем знания при старте
  await loadKnowledge()
  
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'add':
      if (!args[1]) {
        console.error('❌ Укажи текст')
        process.exit(1)
      }
      await addText(args[1])
      break
      
    case 'add-file':
      if (!args[1]) {
        console.error('❌ Укажи путь к файлу')
        process.exit(1)
      }
      await addFile(args[1])
      break
      
    case 'stats':
      await stats()
      break
      
    case 'list':
      await list(args[1])
      break
      
    default:
      console.log(`
📦 Архивариус CLI (упрощенная версия)

Команды:
  add "текст"            - добавить текст
  add-file file.html     - добавить файл
  stats                  - статистика
  list [namespace]       - список записей

Примеры:
  pnpm tsx scripts/archivist-simple.ts add "Мой текст"
  pnpm tsx scripts/archivist-simple.ts add-file "файл.html"
  pnpm tsx scripts/archivist-simple.ts stats
  pnpm tsx scripts/archivist-simple.ts list copywriter
`)
  }
}

main().catch(console.error)
