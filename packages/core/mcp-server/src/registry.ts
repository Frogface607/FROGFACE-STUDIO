import { BaseAgent } from '@frogface/core-agent-base'
import type { AgentRegistry } from './types'

/**
 * Реестр агентов - централизованное хранилище всех агентов
 */
class AgentRegistryManager {
  private agents: AgentRegistry = {}

  /**
   * Зарегистрировать агента
   */
  register(agent: BaseAgent): void {
    if (this.agents[agent.name]) {
      throw new Error(`Агент с именем "${agent.name}" уже зарегистрирован`)
    }
    this.agents[agent.name] = agent
    console.log(`✅ Агент "${agent.name}" зарегистрирован`)
  }

  /**
   * Получить агента по имени
   */
  get(agentId: string): BaseAgent | undefined {
    return this.agents[agentId]
  }

  /**
   * Получить всех агентов
   */
  getAll(): AgentRegistry {
    return { ...this.agents }
  }

  /**
   * Получить список всех агентов (метаданные)
   */
  list(): Array<ReturnType<BaseAgent['getInfo']>> {
    return Object.values(this.agents).map((agent) => agent.getInfo())
  }

  /**
   * Проверить, зарегистрирован ли агент
   */
  has(agentId: string): boolean {
    return agentId in this.agents
  }

  /**
   * Удалить агента
   */
  unregister(agentId: string): boolean {
    if (this.agents[agentId]) {
      delete this.agents[agentId]
      console.log(`❌ Агент "${agentId}" удален из реестра`)
      return true
    }
    return false
  }
}

// Singleton instance
export const agentRegistry = new AgentRegistryManager()

