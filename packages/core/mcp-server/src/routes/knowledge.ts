/**
 * API routes для управления базой знаний
 */

import { FastifyInstance } from 'fastify'
import {
  addToKnowledgeBase,
  queryKnowledgeBase,
  getAllFromNamespace,
  removeFromKnowledgeBase,
  bulkLoadKnowledge,
  seedKnowledgeBase,
} from '../../knowledge-base/src/index'

export async function knowledgeRoutes(fastify: FastifyInstance) {
  /**
   * POST /mcp/knowledge - Добавить знание
   */
  fastify.post<{
    Body: {
      content: string
      namespace: string
      metadata?: Record<string, unknown>
    }
  }>('/mcp/knowledge', async (request, reply) => {
    const { content, namespace, metadata } = request.body

    if (!content || !namespace) {
      return reply.status(400).send({
        success: false,
        error: 'content и namespace обязательны',
      })
    }

    try {
      const id = await addToKnowledgeBase(content, namespace, metadata)
      return reply.send({ success: true, id })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  /**
   * GET /mcp/knowledge/search - Поиск в базе знаний
   */
  fastify.get<{
    Querystring: {
      query: string
      namespace: string
      limit?: string
    }
  }>('/mcp/knowledge/search', async (request, reply) => {
    const { query, namespace, limit = '5' } = request.query

    if (!query || !namespace) {
      return reply.status(400).send({
        success: false,
        error: 'query и namespace обязательны',
      })
    }

    try {
      const results = await queryKnowledgeBase(query, namespace, parseInt(limit, 10))
      return reply.send({ success: true, data: results })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  /**
   * GET /mcp/knowledge/:namespace - Получить все знания из namespace
   */
  fastify.get<{
    Params: { namespace: string }
  }>('/mcp/knowledge/:namespace', async (request, reply) => {
    const { namespace } = request.params

    try {
      const results = await getAllFromNamespace(namespace)
      return reply.send({ success: true, data: results })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  /**
   * DELETE /mcp/knowledge/:id - Удалить знание
   */
  fastify.delete<{
    Params: { id: string }
  }>('/mcp/knowledge/:id', async (request, reply) => {
    const { id } = request.params

    try {
      const deleted = removeFromKnowledgeBase(id)
      return reply.send({ success: deleted })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  /**
   * POST /mcp/knowledge/bulk - Массовая загрузка
   */
  fastify.post<{
    Body: {
      sources: Array<{
        type: 'file' | 'directory' | 'json'
        path: string
        namespace: string
        metadata?: Record<string, unknown>
      }>
    }
  }>('/mcp/knowledge/bulk', async (request, reply) => {
    const { sources } = request.body

    if (!sources || !Array.isArray(sources)) {
      return reply.status(400).send({
        success: false,
        error: 'sources должен быть массивом',
      })
    }

    try {
      const results = await bulkLoadKnowledge(sources)
      return reply.send({ success: true, data: results })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  /**
   * POST /mcp/knowledge/reload - Перезагрузить знания из файлов
   */
  fastify.post('/mcp/knowledge/reload', async (request, reply) => {
    try {
      await seedKnowledgeBase()
      return reply.send({ success: true, message: 'Знания перезагружены' })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })
}

