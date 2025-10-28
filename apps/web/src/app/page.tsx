'use client'

import { useState, useEffect } from 'react'
import AgentTabs from '@/components/AgentTabs'
import AgentChat from '@/components/AgentChat'
import ArchivistUpload from '@/components/ArchivistUpload'

const MCP_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Home() {
  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showArchivist, setShowArchivist] = useState(false)

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const response = await fetch(`${MCP_API_URL}/mcp/agents`)
      const data = await response.json()
      if (data.success) {
        setAgents(data.data)
        if (data.data.length > 0) {
          setSelectedAgent(data.data[0].name)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки агентов:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Загрузка...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🐸 Frogface Studio
          </h1>
          <p className="text-gray-600 mb-4">
            Единая AI-экосистема для управления специализированными агентами
          </p>
          <button
            onClick={() => setShowArchivist(!showArchivist)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {showArchivist ? '💬 К агентам' : '📦 Архивариус'}
          </button>
        </header>

        {showArchivist ? (
          <ArchivistUpload apiUrl={MCP_API_URL} onUploadComplete={() => setShowArchivist(false)} />
        ) : agents.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Агенты не найдены
            </h2>
            <p className="text-yellow-700">
              Убедитесь, что MCP-сервер запущен и агенты зарегистрированы.
            </p>
            <button
              onClick={loadAgents}
              className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Обновить
            </button>
          </div>
        ) : (
          <>
            <AgentTabs
              agents={agents}
              selectedAgent={selectedAgent}
              onSelectAgent={setSelectedAgent}
            />
            {selectedAgent && (
              <AgentChat agentId={selectedAgent} apiUrl={MCP_API_URL} />
            )}
          </>
        )}
      </div>
    </main>
  )
}

