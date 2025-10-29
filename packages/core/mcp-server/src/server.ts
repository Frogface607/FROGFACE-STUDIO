import Fastify from 'fastify'
import cors from '@fastify/cors'
import { agentRegistry } from './registry'
import { registerAllAgents } from './register-agents'
import { seedKnowledgeBase, createKnowledgeStructure } from '../../knowledge-base/src/index'
import { knowledgeRoutes } from './routes/knowledge'
import { uploadRoutes } from './routes/upload'
import type { MCPCommand, MCPResponse, TaskQueueItem } from './types'
import { BaseAgent } from '../../agent-base/src/index'

const fastify = Fastify({
  logger: true,
})

// Регистрация CORS
fastify.register(cors, {
  origin: true, // В production указать конкретные домены
})

// Очередь задач
const taskQueue: Map<string, TaskQueueItem> = new Map()

/**
 * Обработка команды
 */
async function processCommand(command: MCPCommand): Promise<MCPResponse> {
  try {
    switch (command.type) {
      case 'list_agents': {
        const agents = agentRegistry.list()
        return { success: true, data: agents }
      }

      case 'execute': {
        if (!command.agentId || !command.task) {
          return {
            success: false,
            error: 'agentId и task обязательны для выполнения',
          }
        }

        const agent = agentRegistry.get(command.agentId)
        if (!agent) {
          return {
            success: false,
            error: `Агент "${command.agentId}" не найден`,
          }
        }

        // Создаем задачу в очереди
        const taskItem: TaskQueueItem = {
          id: command.task.id || `task-${Date.now()}`,
          agentId: command.agentId,
          task: command.task,
          status: 'processing',
          createdAt: new Date(),
        }
        taskQueue.set(taskItem.id, taskItem)

        try {
          // Выполняем задачу
          const result = await agent.execute(command.task)
          taskItem.status = 'completed'
          taskItem.completedAt = new Date()
          taskItem.result = result

          return {
            success: true,
            agentResponse: result,
            data: { taskId: taskItem.id, status: 'completed' },
          }
        } catch (error) {
          taskItem.status = 'failed'
          taskItem.completedAt = new Date()
          taskItem.error = error instanceof Error ? error.message : 'Unknown error'

          return {
            success: false,
            error: taskItem.error,
            data: { taskId: taskItem.id, status: 'failed' },
          }
        }
      }

      case 'status': {
        const status = {
          agentsCount: agentRegistry.list().length,
          tasksInQueue: taskQueue.size,
          agents: agentRegistry.list(),
        }
        return { success: true, data: status }
      }

      default:
        return {
          success: false,
          error: `Неизвестный тип команды: ${command.type}`,
        }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// API Routes

/**
 * POST /mcp/command - Выполнить команду
 */
fastify.post<{ Body: MCPCommand }>('/mcp/command', async (request, reply) => {
  const command = request.body
  const response = await processCommand(command)
  return reply.send(response)
})

/**
 * GET /mcp/agents - Список всех агентов
 */
fastify.get('/mcp/agents', async (request, reply) => {
  const agents = agentRegistry.list()
  return reply.send({ success: true, data: agents })
})

/**
 * POST /mcp/agents/:id/task - Назначить задачу агенту
 */
fastify.post<{ Params: { id: string }; Body: { task: any } }>(
  '/mcp/agents/:id/task',
  async (request, reply) => {
    const { id } = request.params
    const { task } = request.body

    if (!task) {
      return reply.status(400).send({ success: false, error: 'Task обязателен' })
    }

    const command: MCPCommand = {
      type: 'execute',
      agentId: id,
      task: {
        id: task.id || `task-${Date.now()}`,
        prompt: task.prompt,
        context: task.context,
        metadata: task.metadata,
      },
    }

    const response = await processCommand(command)
    return reply.send(response)
  }
)

/**
 * GET /mcp/tasks - Список задач
 */
fastify.get('/mcp/tasks', async (request, reply) => {
  const tasks = Array.from(taskQueue.values())
  return reply.send({ success: true, data: tasks })
})

/**
 * GET /mcp/status - Статус системы
 */
fastify.get('/mcp/status', async (request, reply) => {
  const response = await processCommand({ type: 'status' })
  return reply.send(response)
})

/**
 * GET / - Health check
 */
fastify.get('/', async (request, reply) => {
  return reply.send({
    name: 'Frogface Studio MCP Server',
    version: '0.1.0',
    status: 'running',
  })
})

// Регистрируем routes для управления знаниями
fastify.register(knowledgeRoutes)
fastify.register(uploadRoutes)

// Запуск сервера
const start = async () => {
  try {
    // Создаем структуру директорий для знаний (если нужно)
    try {
      await createKnowledgeStructure('./knowledge')
    } catch (error) {
      console.warn('⚠️  Не удалось создать структуру знаний:', error)
    }

    // Загружаем начальные знания
    try {
      await seedKnowledgeBase()
    } catch (error) {
      console.warn('⚠️  Не удалось загрузить знания:', error)
    }

    // Регистрируем всех агентов
    registerAllAgents()
    
    // Railway использует переменную PORT, но мы можем также использовать MCP_PORT
    const port = parseInt(process.env.PORT || process.env.MCP_PORT || '3001', 10)
    const host = process.env.MCP_HOST || '0.0.0.0'

    await fastify.listen({ port, host })
    console.log(`🚀 MCP Server запущен на http://${host}:${port}`)
    console.log(`📋 Доступно агентов: ${agentRegistry.list().length}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await fastify.close()
  console.log('🛑 MCP Server остановлен')
})

// Запуск сервера (только если файл запускается напрямую, не при импорте)
if (require.main === module) {
  start()
}

export { fastify }

