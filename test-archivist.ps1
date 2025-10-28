# Тестовый скрипт для архивариуса
$env:OPENROUTER_API_KEY="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"

Write-Host "🧪 Тестирую архивариуса..."
Write-Host ""

# Тест 1: Добавить простой текст
Write-Host "📝 Тест 1: Добавляю тестовый текст..."
cd "C:\Users\Sergey\FROGFACE STUDIO"
npx tsx scripts/archivist-cli.ts add "Пример поста для концерта Embers. Дата: 15 декабря. Место: Клуб."

Write-Host ""
Write-Host ""

# Тест 2: Статистика
Write-Host "📊 Тест 2: Статистика базы знаний..."
npx tsx scripts/archivist-cli.ts stats

Write-Host ""
Write-Host ""

# Тест 3: Поиск
Write-Host "🔍 Тест 3: Поиск..."
npx tsx scripts/archivist-cli.ts search "Embers"

Write-Host ""
Write-Host "✅ Тесты завершены!"

