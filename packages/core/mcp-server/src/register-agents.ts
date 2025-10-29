/**
 * Файл для регистрации всех агентов
 * Импортируй и зарегистрируй здесь всех агентов
 */

import { agentRegistry } from './registry'

// Импорт агентов
import { CopywriterAgent } from '../../../agents/copywriter/src/index'
import { ArchivistAgent } from '../../../agents/archivist/src/index'
import { EdisonCopywriterAgent } from '../../../agents/edison-copywriter/src/index'
// import { ResearcherAgent } from '@frogface/agent-researcher'
// ... другие агенты

/**
 * Регистрация всех агентов
 * Вызывается при старте MCP-сервера
 */
export function registerAllAgents() {
  // Регистрируем агентов
  agentRegistry.register(new CopywriterAgent())
  agentRegistry.register(new EdisonCopywriterAgent()) // Специальный копирайтер для Edison Craft
  agentRegistry.register(new ArchivistAgent())
  // agentRegistry.register(new ResearcherAgent())
  
  console.log(`📋 Всего зарегистрировано агентов: ${agentRegistry.list().length}`)
}

