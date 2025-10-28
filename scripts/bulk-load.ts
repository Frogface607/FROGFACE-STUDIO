#!/usr/bin/env tsx
/**
 * Массовая загрузка файлов в базу знаний
 * 
 * Использование:
 *   pnpm tsx scripts/bulk-load.ts ./knowledge-source/
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { bulkLoadKnowledge } from '../packages/core/knowledge-base/src/loader'

// Загружаем env (если dotenv установлен)
try {
  const dotenv = require('dotenv')
  dotenv.config({ path: path.join(__dirname, '../.env.local') })
} catch {
  // dotenv не установлен, используем системные переменные
}

async function main() {
  const sourceDir = process.argv[2] || './knowledge-source'
  
  console.log(`🚀 Массовая загрузка из: ${sourceDir}\n`)
  
  try {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true })
    
    const sources: Array<{
      type: 'file' | 'directory' | 'json'
      path: string
      namespace: string
      metadata?: Record<string, unknown>
    }> = []
    
    // Автоматически определяем namespace по имени папки/файла
    for (const entry of entries) {
      const fullPath = path.join(sourceDir, entry.name)
      const name = entry.name.toLowerCase()
      
      let namespace = 'global'
      if (name.includes('copywriter') || name.includes('копирайт') || name.includes('пост')) {
        namespace = 'copywriter'
      } else if (name.includes('research') || name.includes('исследован')) {
        namespace = 'researcher'
      } else if (name.includes('smm') || name.includes('соцсет')) {
        namespace = 'smm'
      }
      
      if (entry.isDirectory()) {
        sources.push({
          type: 'directory',
          path: fullPath,
          namespace,
        })
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (['.txt', '.md'].includes(ext)) {
          sources.push({
            type: 'file',
            path: fullPath,
            namespace,
            metadata: { fileName: entry.name },
          })
        } else if (ext === '.json') {
          sources.push({
            type: 'json',
            path: fullPath,
            namespace,
          })
        }
      }
    }
    
    if (sources.length === 0) {
      console.log('❌ Файлы не найдены')
      return
    }
    
    console.log(`📋 Найдено ${sources.length} источников для загрузки\n`)
    
    const results = await bulkLoadKnowledge(sources)
    
    console.log('\n✅ Загрузка завершена:')
    for (const [namespace, count] of Object.entries(results)) {
      console.log(`   ${namespace}: ${count} чанков`)
    }
  } catch (error) {
    console.error('❌ Ошибка:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

main()

