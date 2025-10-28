# Запуск MCP Server с ключом
cd "C:\Users\Sergey\FROGFACE STUDIO\packages\core\mcp-server"
$env:OPENROUTER_API_KEY="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"
$env:MCP_PORT="3001"
$env:MCP_HOST="localhost"
Write-Host "🚀 Запускаю MCP Server с ключом OpenRouter..."
Write-Host "Порт: $env:MCP_PORT"
npx tsx src/server.ts


