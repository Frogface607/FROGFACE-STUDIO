# 🔧 КОМАНДЫ ДЛЯ RAILWAY (копируй точно!)

## 📋 Где вводить команды в Railway

1. Зайди в Railway → твой проект
2. Выбери сервис (или создай новый)
3. Перейди в **"Settings"** (иконка шестерёнки)
4. В разделе **"Deploy"** найди поле **"Start Command"**

## ✅ Команды для копирования

### Build Command:
```
pnpm install && pnpm --filter @frogface/core-mcp build
```

### Start Command:
```
cd packages/core/mcp-server && node dist/server.js
```

## ⚠️ ВАЖНО!

**В Railway Settings:**
- **Root Directory** - оставь ПУСТЫМ (не указывай ничего!)
- **Build Command** - вставь команду выше (НЕ путь к файлу!)
- **Start Command** - вставь команду выше (НЕ путь к файлу!)

## 🔍 Как правильно вводить

1. Найди поле **"Start Command"** в Settings
2. Удали всё что там есть (если есть)
3. Вставь ТОЛЬКО команду (без кавычек):
   ```
   cd packages/core/mcp-server && node dist/server.js
   ```
4. НЕ кликай на файл - это поле для команды, а не для выбора файла!
5. Нажми **Save**

## 💡 Альтернатива (если все равно не работает)

Попробуй без `cd`:
```
node packages/core/mcp-server/dist/server.js
```

---

**Главное - это поле для команды, а не для выбора файла! Просто вставь текст команды.** 🚀

