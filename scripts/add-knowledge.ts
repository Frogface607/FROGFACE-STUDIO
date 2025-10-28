#!/usr/bin/env tsx
/**
 * Скрипт для быстрого добавления знаний в базу
 * Использование:
 *   pnpm tsx scripts/add-knowledge.ts copywriter "Текст для добавления"
 */

import { addToKnowledgeBase } from '../packages/core/knowledge-base/src/index'

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 2) {
    console.log('Использование: pnpm tsx scripts/add-knowledge.ts <namespace> <text> [metadata]')
    console.log('Пример: pnpm tsx scripts/add-knowledge.ts copywriter "Пример поста"')
    process.exit(1)
  }

  const [namespace, text, ...metadataParts] = args
  const metadataStr = metadataParts.join(' ')
  
  let metadata: Record<string, unknown> = {}
  if (metadataStr) {
    try {
      metadata = JSON.parse(metadataStr)
    } catch {
      // Если не JSON, просто добавляем как строку
      metadata = { note: metadataStr }
    }
  }

  try {
    const id = await addToKnowledgeBase(text, namespace, {
      ...metadata,
      addedAt: new Date().toISOString(),
      source: 'script',
    })
    
    console.log(`✅ Знание добавлено!`)
    console.log(`   ID: ${id}`)
    console.log(`   Namespace: ${namespace}`)
    console.log(`   Текст: ${text.substring(0, 50)}...`)
  } catch (error) {
    console.error('❌ Ошибка:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()

