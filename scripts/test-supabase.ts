#!/usr/bin/env tsx
/**
 * Тест подключения к Supabase
 */

import * as dotenv from 'dotenv'
import * as path from 'path'
import { SupabaseKnowledgeAdapter } from '../packages/core/knowledge-base/src/supabase-adapter'

// Загружаем .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') })

async function main() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!url || !serviceKey) {
    console.error('❌ SUPABASE_URL или SUPABASE_SERVICE_KEY не установлены в .env.local')
    process.exit(1)
  }

  console.log('🧪 Тестирую подключение к Supabase...\n')
  console.log(`URL: ${url}\n`)

  const adapter = new SupabaseKnowledgeAdapter({ url, serviceKey })

  // Тест 1: Ping
  console.log('1️⃣ Проверка подключения...')
  const isConnected = await adapter.ping()
  if (isConnected) {
    console.log('✅ Подключение к Supabase успешно!\n')
  } else {
    console.log('❌ Не удалось подключиться к Supabase\n')
    process.exit(1)
  }

  // Тест 2: Добавить тестовый элемент
  console.log('2️⃣ Добавляю тестовый элемент...')
  try {
    const id = await adapter.add(
      'Тестовый контент для проверки Supabase',
      'test',
      { source: 'test-script', timestamp: new Date().toISOString() }
    )
    console.log(`✅ Элемент добавлен! ID: ${id}\n`)
  } catch (error) {
    console.error('❌ Ошибка при добавлении:', error)
    process.exit(1)
  }

  // Тест 3: Поиск
  console.log('3️⃣ Тестирую поиск...')
  try {
    const results = await adapter.search('тестовый', 'test', 5)
    console.log(`✅ Найдено ${results.length} результатов\n`)
    results.forEach((r, idx) => {
      console.log(`${idx + 1}. ${r.content.substring(0, 50)}...`)
      console.log(`   Similarity: ${r.similarity}\n`)
    })
  } catch (error) {
    console.error('❌ Ошибка при поиске:', error)
  }

  // Тест 4: Получить все
  console.log('4️⃣ Получаю все элементы из namespace "test"...')
  try {
    const all = await adapter.getAll('test')
    console.log(`✅ Найдено ${all.length} элементов в namespace "test"\n`)
  } catch (error) {
    console.error('❌ Ошибка при получении всех:', error)
  }

  console.log('✅ Все тесты пройдены! Supabase готов к работе! 🚀')
}

main().catch(console.error)

