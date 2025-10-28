/**
 * Обработчики разных типов файлов
 */

/**
 * Извлечь текст из HTML
 */
export function extractTextFromHTML(html: string): string {
  // Удаляем скрипты и стили
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  
  // Удаляем HTML теги
  text = text.replace(/<[^>]+>/g, ' ')
  
  // Декодируем HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
  
  // Убираем множественные пробелы и переносы строк
  text = text.replace(/\s+/g, ' ').trim()
  
  return text
}

/**
 * Извлечь структуру из HTML (заголовки, списки и т.д.)
 */
export function extractHTMLStructure(html: string): {
  title?: string
  headings: string[]
  paragraphs: string[]
  lists: string[]
} {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].trim() : undefined
  
  const headings: string[] = []
  const headingRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi
  let match
  while ((match = headingRegex.exec(html)) !== null) {
    const heading = match[1].replace(/<[^>]+>/g, '').trim()
    if (heading) headings.push(heading)
  }
  
  const paragraphs: string[] = []
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
  while ((match = pRegex.exec(html)) !== null) {
    const para = match[1].replace(/<[^>]+>/g, '').trim()
    if (para && para.length > 20) paragraphs.push(para)
  }
  
  const lists: string[] = []
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
  while ((match = liRegex.exec(html)) !== null) {
    const item = match[1].replace(/<[^>]+>/g, '').trim()
    if (item) lists.push(item)
  }
  
  return { title, headings, paragraphs, lists }
}

/**
 * Обработать файл в зависимости от типа
 */
export async function processFile(fileName: string, content: Buffer): Promise<string> {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  
  switch (ext) {
    case 'html':
    case 'htm':
      const htmlText = content.toString('utf-8')
      const structure = extractHTMLStructure(htmlText)
      const cleanText = extractTextFromHTML(htmlText)
      
      // Создаем структурированный текст
      let result = ''
      if (structure.title) {
        result += `# ${structure.title}\n\n`
      }
      if (structure.headings.length > 0) {
        result += '## Заголовки:\n'
        structure.headings.forEach(h => result += `- ${h}\n`)
        result += '\n'
      }
      if (structure.paragraphs.length > 0) {
        result += '## Содержание:\n'
        structure.paragraphs.forEach(p => result += `${p}\n\n`)
      } else {
        // Если нет параграфов, используем весь очищенный текст
        result += cleanText.substring(0, 10000) // Ограничиваем размер
      }
      
      return result
      
    case 'json':
      try {
        const json = JSON.parse(content.toString('utf-8'))
        return JSON.stringify(json, null, 2)
      } catch {
        return content.toString('utf-8')
      }
      
    case 'md':
    case 'markdown':
      return content.toString('utf-8')
      
    case 'txt':
    default:
      // Пробуем разные кодировки
      try {
        return content.toString('utf-8')
      } catch {
        try {
          return content.toString('utf-16le')
        } catch {
          return content.toString('latin1')
        }
      }
  }
}

