/**
 * MCP сервер для работы через stdio (для подключения ChatGPT)
 * 
 * Этот модуль реализует MCP протокол через stdio transport,
 * что позволяет ChatGPT напрямую подключаться к Frogface Studio
 */

import { agentRegistry } from './registry'
import { registerAllAgents } from './register-agents'
import { seedKnowledgeBase, createKnowledgeStructure } from '../../knowledge-base/src/index'

/**
 * MCP Tools (функции, доступные ChatGPT)
 */
const MCP_TOOLS = {
  list_agents: {
    name: 'list_agents',
    description: 'Получить список всех доступных агентов в Frogface Studio',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  
  execute_agent_task: {
    name: 'execute_agent_task',
    description: 'Выполнить задачу через указанного агента (copywriter, archivist, researcher и т.д.)',
    parameters: {
      type: 'object',
      properties: {
        agent_id: {
          type: 'string',
          description: 'ID агента (например: copywriter, archivist)',
          enum: ['copywriter', 'archivist'],
        },
        prompt: {
          type: 'string',
          description: 'Задача для агента',
        },
        context: {
          type: 'object',
          description: 'Дополнительный контекст для задачи',
          additionalProperties: true,
        },
      },
      required: ['agent_id', 'prompt'],
    },
  },

  archive_content: {
    name: 'archive_content',
    description: 'Архивировать контент через агента-архивариуса. Контент будет автоматически классифицирован и сохранен в нужное место в базе знаний.',
    parameters: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Контент для архивации',
        },
        metadata: {
          type: 'object',
          description: 'Дополнительные метаданные',
          additionalProperties: true,
        },
      },
      required: ['content'],
    },
  },

  search_knowledge: {
    name: 'search_knowledge',
    description: 'Поиск информации в базе знаний по запросу',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Поисковый запрос',
        },
        namespace: {
          type: 'string',
          description: 'Namespace для поиска (copywriter, researcher, global и т.д.)',
        },
        limit: {
          type: 'number',
          description: 'Максимальное количество результатов',
          default: 5,
        },
      },
      required: ['query'],
    },
  },
}

/**
 * Обработка MCP запросов
 */
async function handleMCPRequest(request: any): Promise<any> {
  try {
    // Инициализация при первом запросе
    if (!agentRegistry.list().length) {
      await initializeServices()
    }

    switch (request.method) {
      case 'tools/list':
        return {
          tools: Object.values(MCP_TOOLS),
        }

      case 'tools/call':
        return await handleToolCall(request.params)

      case 'initialize':
        await initializeServices()
        return {
          protocolVersion: '1.0',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'frogface-studio',
            version: '0.1.0',
          },
        }

      default:
        throw new Error(`Unknown method: ${request.method}`)
    }
  } catch (error) {
    return {
      error: {
        code: -1,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

/**
 * Инициализация сервисов
 */
async function initializeServices() {
  try {
    await createKnowledgeStructure('./knowledge')
  } catch (error) {
    console.warn('⚠️  Не удалось создать структуру знаний:', error)
  }

  try {
    await seedKnowledgeBase()
  } catch (error) {
    console.warn('⚠️  Не удалось загрузить знания:', error)
  }

  registerAllAgents()
}

/**
 * Обработка вызова инструмента
 */
async function handleToolCall(params: any): Promise<any> {
  const { name, arguments: args } = params

  switch (name) {
    case 'list_agents': {
      const agents = agentRegistry.list()
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(agents, null, 2),
          },
        ],
      }
    }

    case 'execute_agent_task': {
      const { agent_id, prompt, context } = args
      const agent = agentRegistry.get(agent_id)

      if (!agent) {
        throw new Error(`Агент "${agent_id}" не найден`)
      }

      const task = {
        id: `mcp-${Date.now()}`,
        prompt,
        context: context || {},
      }

      const result = await agent.execute(task)
      
      return {
        content: [
          {
            type: 'text',
            text: result.result,
          },
        ],
        metadata: result.metadata,
      }
    }

    case 'archive_content': {
      const { content, metadata } = args
      const archivist = agentRegistry.get('archivist')

      if (!archivist) {
        throw new Error('Архивариус не зарегистрирован')
      }

      const task = {
        id: `archive-${Date.now()}`,
        prompt: content,
        context: {
          operation: 'analyze_and_store',
          ...metadata,
        },
      }

      const result = await archivist.execute(task)
      
      return {
        content: [
          {
            type: 'text',
            text: result.result,
          },
        ],
      }
    }

    case 'search_knowledge': {
      const { query, namespace = 'global', limit = 5 } = args
      const { queryKnowledgeBase } = await import('../../knowledge-base/src/index')
      
      const results = await queryKnowledgeBase(query, namespace, limit)
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(results, null, 2),
          },
        ],
      }
    }

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
}

/**
 * Запуск MCP сервера через stdio
 */
if (require.main === module) {
  import('readline').then((readlineModule) => {
    const readline = readlineModule.default || readlineModule
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    })

    rl.on('line', async (line: string) => {
      try {
        const request = JSON.parse(line)
        const response = await handleMCPRequest(request)
        
        console.log(JSON.stringify({
          jsonrpc: '2.0',
          id: request.id,
          result: response,
        }))
      } catch (error) {
        const request = (error as any).request || {}
        console.error(JSON.stringify({
          jsonrpc: '2.0',
          id: request.id || null,
          error: {
            code: -1,
            message: error instanceof Error ? error.message : 'Unknown error',
          },
        }))
      }
    })

    console.error('🐸 Frogface Studio MCP Server (stdio) запущен')
  }).catch((error) => {
    console.error('Ошибка запуска MCP сервера:', error)
    process.exit(1)
  })
}

export { handleMCPRequest, MCP_TOOLS }

