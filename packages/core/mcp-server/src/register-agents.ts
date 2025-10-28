/**
 * Файл для регистрации всех агентов
 * Импортируй и зарегистрируй здесь всех агентов
 */

import { agentRegistry } from './registry'

// Импорт агентов
import { CopywriterAgent } from '@frogface/agent-copywriter'
import { ArchivistAgent } from '@frogface/agent-archivist'
// import { ResearcherAgent } from '@frogface/agent-researcher'
// ... другие агенты

/**
 * Регистрация всех агентов
 * Вызывается при старте MCP-сервера
 */
export function registerAllAgents() {
  // Регистрируем агентов
  agentRegistry.register(new CopywriterAgent())
  agentRegistry.register(new ArchivistAgent())
  // agentRegistry.register(new ResearcherAgent())
  
  console.log(`📋 Всего зарегистрировано агентов: ${agentRegistry.list().length}`)
}

