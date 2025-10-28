/**
 * Система начальной загрузки знаний (seeder)
 * Используется для первоначального наполнения базы знаний
 */

import { bulkLoadKnowledge } from './loader'
import * as path from 'path'
import * as fs from 'fs/promises'

/**
 * Настройки seeder'а
 */
interface SeederConfig {
  knowledgeDir?: string
  namespaces: {
    [namespace: string]: {
      files?: string[]
      directories?: string[]
      jsonFiles?: string[]
    }
  }
}

const DEFAULT_CONFIG: SeederConfig = {
  knowledgeDir: './knowledge',
  namespaces: {
    copywriter: {
      files: ['examples.txt', 'styles.txt'],
      directories: ['posts'],
    },
    researcher: {
      directories: ['research'],
      jsonFiles: ['notes.json'],
    },
    global: {
      directories: ['general'],
    },
  },
}

/**
 * Загрузить начальные знания из конфигурации
 */
export async function seedKnowledgeBase(config: SeederConfig = DEFAULT_CONFIG): Promise<void> {
  const knowledgeDir = config.knowledgeDir || './knowledge'
  const sources: Array<{
    type: 'file' | 'directory' | 'json'
    path: string
    namespace: string
    metadata?: Record<string, unknown>
  }> = []

  // Проверяем существование директории
  try {
    await fs.access(knowledgeDir)
  } catch {
    console.log(`📁 Создаю директорию знаний: ${knowledgeDir}`)
    await fs.mkdir(knowledgeDir, { recursive: true })
  }

  // Собираем все источники для загрузки
  for (const [namespace, sources_config] of Object.entries(config.namespaces)) {
    const namespaceDir = path.join(knowledgeDir, namespace)

    // Файлы
    if (sources_config.files) {
      for (const file of sources_config.files) {
        const filePath = path.join(namespaceDir, file)
        try {
          await fs.access(filePath)
          sources.push({
            type: 'file',
            path: filePath,
            namespace,
          })
        } catch {
          console.warn(`⚠️  Файл не найден: ${filePath}`)
        }
      }
    }

    // Директории
    if (sources_config.directories) {
      for (const dir of sources_config.directories) {
        const dirPath = path.join(namespaceDir, dir)
        try {
          await fs.access(dirPath)
          sources.push({
            type: 'directory',
            path: dirPath,
            namespace,
          })
        } catch {
          console.warn(`⚠️  Директория не найдена: ${dirPath}`)
        }
      }
    }

    // JSON файлы
    if (sources_config.jsonFiles) {
      for (const jsonFile of sources_config.jsonFiles) {
        const filePath = path.join(namespaceDir, jsonFile)
        try {
          await fs.access(filePath)
          sources.push({
            type: 'json',
            path: filePath,
            namespace,
          })
        } catch {
          console.warn(`⚠️  JSON файл не найден: ${filePath}`)
        }
      }
    }
  }

  // Загружаем знания
  if (sources.length > 0) {
    console.log(`🚀 Начинаю загрузку знаний из ${sources.length} источников...`)
    const results = await bulkLoadKnowledge(sources)

    console.log('\n✅ Загрузка знаний завершена:')
    for (const [namespace, count] of Object.entries(results)) {
      console.log(`   ${namespace}: ${count} чанков`)
    }
  } else {
    console.log('📝 Источники знаний не найдены. Создай файлы в директории knowledge/')
  }
}

/**
 * Создать структуру директорий для знаний
 */
export async function createKnowledgeStructure(baseDir = './knowledge'): Promise<void> {
  const structure = {
    copywriter: ['posts', 'examples', 'styles'],
    researcher: ['research', 'notes'],
    smm: ['strategies', 'analytics'],
    psychologist: ['diary', 'insights'],
    archivist: ['archive', 'index'],
    global: ['general', 'shared'],
  }

  for (const [namespace, subdirs] of Object.entries(structure)) {
    const namespaceDir = path.join(baseDir, namespace)
    await fs.mkdir(namespaceDir, { recursive: true })

    for (const subdir of subdirs) {
      await fs.mkdir(path.join(namespaceDir, subdir), { recursive: true })
    }
  }

  // Создаем примеры файлов
  await fs.writeFile(
    path.join(baseDir, 'copywriter/examples.txt'),
    `Примеры успешных постов:

1. Анонс концерта:
"🔥 ВНИМАНИЕ! Концерт Embers в эту пятницу!
Когда: [дата] в [время]
Где: [место]
Билеты уже в продаже! Не пропусти! 🎸"

2. Пост-напоминание:
"⏰ Напоминание: через 3 дня концерт!
Кто уже готов? Поднимите руки 🙋‍♂️🙋‍♀️
До встречи на площадке! 🎵"
`
  )

  await fs.writeFile(
    path.join(baseDir, 'README.md'),
    `# База знаний Frogface Studio

Здесь хранятся знания для всех агентов.

## Структура

- \`copywriter/\` - знания для копирайтера (примеры постов, стили)
- \`researcher/\` - исследования и заметки
- \`smm/\` - SMM стратегии и аналитика
- \`psychologist/\` - дневники и инсайты
- \`archivist/\` - архивные материалы
- \`global/\` - общие знания

## Как добавить знания

1. Просто добавь файлы в соответствующие директории
2. Поддерживаемые форматы: .txt, .md, .json
3. Перезапусти MCP-сервер или вызови функцию seedKnowledgeBase()

## Примеры

См. файлы в каждой директории для примеров.
`
  )

  console.log(`✅ Структура директорий создана в ${baseDir}`)
  console.log(`📝 Добавь свои знания в соответствующие папки`)
}

