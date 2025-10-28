'use client'

interface Agent {
  name: string
  description: string
  capabilities: string[]
}

interface AgentTabsProps {
  agents: Agent[]
  selectedAgent: string | null
  onSelectAgent: (agentId: string) => void
}

export default function AgentTabs({
  agents,
  selectedAgent,
  onSelectAgent,
}: AgentTabsProps) {
  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex space-x-1 overflow-x-auto">
        {agents.map((agent) => (
          <button
            key={agent.name}
            onClick={() => onSelectAgent(agent.name)}
            className={`
              px-6 py-3 font-medium text-sm rounded-t-lg transition-colors
              ${
                selectedAgent === agent.name
                  ? 'bg-white text-green-700 border-b-2 border-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <div className="whitespace-nowrap">{agent.name}</div>
            <div className="text-xs text-gray-500 mt-1 hidden sm:block">
              {agent.capabilities.length} возможностей
            </div>
          </button>
        ))}
      </nav>
    </div>
  )
}

