# Скрипт для запуска MCP сервера
$env:OPENROUTER_API_KEY = "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"
$env:MCP_PORT = "3001"
$env:MCP_HOST = "localhost"

Write-Host "🚀 Запускаю MCP Server..."
Write-Host "OPENROUTER_API_KEY установлен: $($env:OPENROUTER_API_KEY.Substring(0,10))..."

cd packages/core/mcp-server
npx tsx src/server.ts


