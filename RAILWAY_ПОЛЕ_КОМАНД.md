# ⚡ РЕШЕНИЕ: Поле команды в Railway

## 🔧 Проблема

Railway открывает файл вместо того чтобы принять команду.

## ✅ Решение

В Railway **"Start Command"** - это текстовое поле для ввода команды, НЕ для выбора файла!

### Что делать:

1. **Зайди в Railway Dashboard**
2. **Проект** → **Settings**
3. **Найди "Start Command"** (это текстовое поле!)

### Вариант 1: Прямой путь

В поле **"Start Command"** введи (скопируй всю строку):

```
node packages/core/mcp-server/dist/server.js
```

### Вариант 2: С cd (если нужно)

```
cd packages/core/mcp-server && node dist/server.js
```

## ⚠️ Важные моменты:

1. **НЕ кликай на файл** - это поле для команды!
2. **Вставь команду как текст** - просто скопируй и вставь
3. **Убедись что Build Command тоже настроен:**

**Build Command:**
```
pnpm install && pnpm --filter @frogface/core-mcp build
```

## 📸 Если всё равно не получается

Попробуй через **railway.toml**:

Я уже обновил файл `railway.toml` и запушил. Railway должен автоматически использовать настройки из этого файла.

Но если Railway их не подхватил:

1. Удали настройки вручную из Railway Settings (Root Directory, Start Command)
2. Railway должен автоматически использовать `railway.toml` из репозитория

---

## 🔄 Перезапуск

После настройки команд:
1. Сохрани настройки
2. Перейди в **Deployments**
3. Нажми **"Redeploy"** или **"Deploy Latest"**

---

**Просто вставь команду в текстовое поле "Start Command"!** 🚀

