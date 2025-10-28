#!/usr/bin/env tsx
/**
 * CLI инструмент для работы с архивариусом локально
 * 
 * Использование:
 *   pnpm tsx scripts/archivist-cli.ts add "текст"           - добавить текст
 *   pnpm tsx scripts/archivist-cli.ts add-file file.html    - добавить файл
 *   pnpm tsx scripts/archivist-cli.ts search "запрос"       - поиск
 *   pnpm tsx scripts/archivist-cli.ts list copywriter       - список по namespace
 *   pnpm tsx scripts/archivist-cli.ts stats                 - статистика
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { addToKnowledgeBase, queryKnowledgeBase, getAllFromNamespace } from '../packages/core/knowledge-base/src/index'
import { processFile } from '../packages/agents/archivist/src/file-handlers'
import { callLLM } from '../packages/core/api-client/src/index'

// Загружаем env переменные (если dotenv установлен)
try {
  const dotenv = require('dotenv')
  dotenv.config({ path: path.join(__dirname, '../.env.local') })
} catch {
  // dotenv не установлен, используем системные переменные
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
    const response = await callLLM(prompt, undefined, 0.3)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch (error) {
    console.warn('Ошибка классификации:', error)
  }

  // Fallback
  const lower = content.toLowerCase()
  if (lower.includes('пост') || lower.includes('анонс')) {
    return { namespace: 'copywriter', category: 'post' }
  }
  if (lower.includes('исследован') || lower.includes('анализ')) {
    return { namespace: 'researcher', category: 'research' }
  }
  return { namespace: 'global', category: 'general' }
}

async function addText(text: string) {
  console.log('📝 Анализирую текст...')
  const classification = await classifyContent(text)
  
  console.log(`✅ Классификация: ${classification.namespace} - ${classification.category}`)
  
  const id = await addToKnowledgeBase(text, classification.namespace, {
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

async function search(query: string, namespace?: string) {
  console.log(`🔍 Поиск: "${query}"${namespace ? ` в ${namespace}` : ''}`)
  
  const results = await queryKnowledgeBase(query, namespace || 'global', 10)
  
  if (results.length === 0) {
    console.log('❌ Ничего не найдено')
    return
  }
  
  console.log(`\n✅ Найдено ${results.length} результатов:\n`)
  results.forEach((result, idx) => {
    console.log(`${idx + 1}. [${result.source || 'unknown'}]`)
    console.log(`   ${result.content.substring(0, 150)}...`)
    console.log(`   Similarity: ${(result.similarity * 100).toFixed(0)}%\n`)
  })
}

async function list(namespace: string) {
  console.log(`📋 Все записи в namespace "${namespace}":\n`)
  
  const results = getAllFromNamespace(namespace)
  
  if (results.length === 0) {
    console.log('❌ Пусто')
    return
  }
  
  console.log(`Всего: ${results.length} записей\n`)
  results.forEach((result, idx) => {
    console.log(`${idx + 1}. [${result.source || 'unknown'}]`)
    console.log(`   ${result.content.substring(0, 100)}...\n`)
  })
}

async function stats() {
  const namespaces = ['copywriter', 'researcher', 'smm', 'psychologist', 'archivist', 'global']
  
  console.log('📊 Статистика базы знаний:\n')
  
  for (const ns of namespaces) {
    const results = getAllFromNamespace(ns)
    if (results.length > 0) {
      console.log(`${ns}: ${results.length} записей`)
    }
  }
}

// Main
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'add':
      if (!args[1]) {
        console.error('❌ Укажи текст: archivist-cli.ts add "текст"')
        process.exit(1)
      }
      await addText(args[1])
      break
      
    case 'add-file':
      if (!args[1]) {
        console.error('❌ Укажи путь к файлу: archivist-cli.ts add-file file.html')
        process.exit(1)
      }
      await addFile(args[1])
      break
      
    case 'search':
      if (!args[1]) {
        console.error('❌ Укажи запрос: archivist-cli.ts search "запрос"')
        process.exit(1)
      }
      await search(args[1], args[2])
      break
      
    case 'list':
      await list(args[1] || 'global')
      break
      
    case 'stats':
      await stats()
      break
      
    default:
      console.log(`
📦 Архивариус CLI

Команды:
  add "текст"            - добавить текст в базу знаний
  add-file file.html     - добавить файл
  search "запрос"        - поиск по базе
  list [namespace]       - список записей (по умолчанию global)
  stats                  - статистика

Примеры:
  pnpm tsx scripts/archivist-cli.ts add "Мой текст"
  pnpm tsx scripts/archivist-cli.ts add-file my-file.html
  pnpm tsx scripts/archivist-cli.ts search "концерт"
  pnpm tsx scripts/archivist-cli.ts list copywriter
  pnpm tsx scripts/archivist-cli.ts stats
`)
  }
}

main().catch(console.error)

