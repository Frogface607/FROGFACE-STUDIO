import { BaseAgent, Task, AgentResponse } from '@frogface/core-agent-base'

/**
 * Типы для MCP-сервера
 */

export interface MCPCommand {
  type: 'execute' | 'query' | 'list_agents' | 'status'
  agentId?: string
  task?: Task
  query?: string
  payload?: Record<string, unknown>
}

export interface MCPResponse {
  success: boolean
  data?: unknown
  error?: string
  agentResponse?: AgentResponse
}

export interface AgentRegistry {
  [agentId: string]: BaseAgent
}

export interface TaskQueueItem {
  id: string
  agentId: string
  task: Task
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: Date
  completedAt?: Date
  result?: AgentResponse
  error?: string
}

