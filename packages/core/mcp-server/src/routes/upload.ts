/**
 * API routes для загрузки файлов
 */

import { FastifyInstance } from 'fastify'
import multipart from '@fastify/multipart'
import { agentRegistry } from '../registry'
import * as fs from 'fs/promises'
import * as path from 'path'
import * as os from 'os'

export async function uploadRoutes(fastify: FastifyInstance) {
  // Регистрируем multipart для загрузки файлов
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  })

  /**
   * POST /mcp/upload - Загрузить файл и передать архивариусу
   */
  fastify.post('/mcp/upload', async (request, reply) => {
    try {
      const archivist = agentRegistry.get('archivist')
      
      if (!archivist) {
        return reply.status(500).send({
          success: false,
          error: 'Архивариус не зарегистрирован',
        })
      }

      const data = await request.file()

      if (!data) {
        return reply.status(400).send({
          success: false,
          error: 'Файл не предоставлен',
        })
      }

      // Сохраняем файл во временную директорию
      const tmpDir = os.tmpdir()
      const tmpPath = path.join(tmpDir, `frogface-${Date.now()}-${data.filename}`)
      
      const buffer = await data.toBuffer()
      await fs.writeFile(tmpPath, buffer)

      // Обрабатываем файл в зависимости от типа
      let content: string
      try {
        const { processFile } = await import('../../../agents/archivist/src/file-handlers')
        content = await processFile(data.filename || 'file', buffer)
      } catch (error) {
        // Если обработчик не загрузился, используем простой способ
        try {
          content = buffer.toString('utf-8')
        } catch {
          content = buffer.toString('latin1')
        }
      }

      // Передаем архивариусу
      const task = {
        id: `upload-${Date.now()}`,
        prompt: content,
        context: {
          operation: 'file_upload',
          filePath: tmpPath,
          fileName: data.filename,
          contentType: data.mimetype,
          content,
        },
      }

      const result = await archivist.execute(task)

      // Удаляем временный файл
      try {
        await fs.unlink(tmpPath)
      } catch {
        // Игнорируем ошибки удаления
      }

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  /**
   * POST /mcp/upload/text - Загрузить текст напрямую
   */
  fastify.post<{
    Body: {
      text: string
      metadata?: Record<string, unknown>
    }
  }>('/mcp/upload/text', async (request, reply) => {
    try {
      const archivist = agentRegistry.get('archivist')
      
      if (!archivist) {
        return reply.status(500).send({
          success: false,
          error: 'Архивариус не зарегистрирован',
        })
      }

      const { text, metadata } = request.body

      if (!text) {
        return reply.status(400).send({
          success: false,
          error: 'text обязателен',
        })
      }

      const task = {
        id: `text-${Date.now()}`,
        prompt: text,
        context: {
          operation: 'analyze_and_store',
          ...metadata,
        },
      }

      const result = await archivist.execute(task)

      return reply.send({
        success: true,
        data: result,
      })
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })
}

