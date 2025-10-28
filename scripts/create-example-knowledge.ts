#!/usr/bin/env tsx
/**
 * Скрипт для создания примеров знаний
 * Запуск: pnpm tsx scripts/create-example-knowledge.ts
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { createKnowledgeStructure } from '../packages/core/knowledge-base/src/seeder'
import { addToKnowledgeBase } from '../packages/core/knowledge-base/src/index'

async function createExamples() {
  console.log('🚀 Создаю примеры знаний...\n')

  // Создаем структуру
  await createKnowledgeStructure('./knowledge')

  // Добавляем примеры программно
  const examples = [
    {
      namespace: 'copywriter',
      content: `Примеры успешных анонсов концертов:

1. Краткий анонс:
"🔥 Embers - живой концерт!
📅 Пятница, 15 декабря в 20:00
📍 Клуб [название]
🎫 Билеты уже в продаже!
Не пропусти! 🎸"

2. Подробный анонс:
"Друзья! Рады объявить о нашем следующем концерте!

🎸 Embers
📅 15 декабря, пятница
🕐 20:00
📍 Клуб [название]

Мы приготовили для вас новые треки и много энергии! До встречи на площадке! 🎵

Билеты: [ссылка]"

3. Пост-напоминание:
"⏰ Напоминание: до концерта Embers осталось 3 дня!
Кто уже готов? Поднимите руки 🙋‍♂️🙋‍♀️
До встречи на площадке! 🎵"`,
    },
    {
      namespace: 'copywriter',
      content: `Стили для разных платформ:

VK:
- Дружелюбный, открытый тон
- Эмодзи используем умеренно (1-2 на пост)
- Хештеги в конце поста
- Длина: 200-500 символов

Telegram:
- Персональный подход
- Можно более неформальный язык
- Больше эмодзи допустимо
- Длина: 100-300 символов

Instagram:
- Визуально привлекательный текст
- История в тексте
- Много хештегов (10-20)
- Длина: 100-200 символов для подписей`,
    },
    {
      namespace: 'copywriter',
      content: `Шаблоны для разных типов постов:

Анонс концерта:
- Дата и время
- Место проведения
- Ссылка на билеты
- Призыв к действию

После концерта:
- Благодарность публике
- Фотографии/видео
- Упоминание следующих событий

Репост отзыва:
- Спасибо за отзыв
- Цитата отзыва
- Призыв подписаться`,
    },
    {
      namespace: 'global',
      content: `Информация о проекте Frogface Studio:

Frogface Studio - это платформа для управления AI-агентами.
Используется для автоматизации творческих и рабочих задач.

Агенты:
- Copywriter - создание текстового контента
- Researcher - исследование
- SMM - управление соцсетями
- И другие специализированные агенты

Все агенты работают через единый MCP-сервер и имеют доступ к общей базе знаний.`,
    },
  ]

  for (const example of examples) {
    try {
      const id = await addToKnowledgeBase(
        example.content,
        example.namespace,
        { source: 'example', createdAt: new Date().toISOString() }
      )
      console.log(`✅ Добавлено в ${example.namespace}: ${id.substring(0, 20)}...`)
    } catch (error) {
      console.error(`❌ Ошибка добавления в ${example.namespace}:`, error)
    }
  }

  console.log('\n✅ Примеры знаний созданы!')
  console.log('📁 Файлы находятся в директории knowledge/')
  console.log('💡 Теперь можно добавлять свои знания в соответствующие папки')
}

createExamples().catch(console.error)

