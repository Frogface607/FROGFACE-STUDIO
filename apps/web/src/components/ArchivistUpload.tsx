'use client'

import { useState } from 'react'

interface ArchivistUploadProps {
  apiUrl: string
  onUploadComplete?: () => void
}

export default function ArchivistUpload({ apiUrl, onUploadComplete }: ArchivistUploadProps) {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTextSubmit = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`${apiUrl}/mcp/upload/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data.result)
        setText('')
        onUploadComplete?.()
      } else {
        setError(data.error || 'Ошибка загрузки')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSubmit = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${apiUrl}/mcp/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data.result)
        setFile(null)
        onUploadComplete?.()
      } else {
        setError(data.error || 'Ошибка загрузки')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        📦 Архивариус - Загрузка знаний
      </h2>
      <p className="text-gray-600 mb-6">
        Загрузи текст или файл. Архивариус проанализирует контент и автоматически
        определит куда его сохранить в базе знаний.
      </p>

      {/* Загрузка текста */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Или вставь текст напрямую:
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Вставь текст для архивации..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
          rows={6}
          disabled={loading}
        />
        <button
          onClick={handleTextSubmit}
          disabled={!text.trim() || loading}
          className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Обработка...' : '📝 Сохранить текст'}
        </button>
      </div>

      {/* Разделитель */}
      <div className="flex items-center mb-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500">или</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Загрузка файла */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Загрузи файл:
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            accept=".txt,.md,.json"
            disabled={loading}
          />
          <button
            onClick={handleFileSubmit}
            disabled={!file || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Обработка...' : '📁 Загрузить файл'}
          </button>
        </div>
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Выбран файл: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {/* Результат */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Результат:</h3>
          <div className="text-green-700 whitespace-pre-wrap">{result}</div>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">❌ Ошибка:</h3>
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {/* Подсказки */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">💡 Как это работает:</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Архивариус анализирует контент через AI</li>
          <li>Автоматически определяет к какому namespace относится</li>
          <li>Извлекает метаданные и теги</li>
          <li>Сохраняет в правильное место в базе знаний</li>
          <li>Агенты смогут использовать эти знания в будущем</li>
        </ul>
      </div>
    </div>
  )
}

