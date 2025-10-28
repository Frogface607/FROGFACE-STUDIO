# 🔧 Настройка Git и GitHub

## ✅ Git репозиторий создан локально

Репозиторий инициализирован в корне проекта. Теперь нужно:

## 📤 Создание репозитория на GitHub

### Шаг 1: Создай репозиторий на GitHub

1. Зайди на https://github.com/new
2. Repository name: `frogface-studio`
3. Description: "Единая AI-экосистема для управления специализированными агентами"
4. Visibility: Private или Public (на твое усмотрение)
5. **НЕ** добавляй README, .gitignore, license (у нас уже есть)
6. Нажми "Create repository"

### Шаг 2: Подключи локальный репозиторий

```bash
# Добавь remote (замени YOUR_USERNAME на свой GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/frogface-studio.git

# Переименуй ветку в main (если нужно)
git branch -M main

# Отправь код
git push -u origin main
```

### Альтернативный способ (если репозиторий уже создан на GitHub)

GitHub покажет команды, используй их.

## 🔐 Защита секретов

**ВАЖНО:** Убедись что `.env.local` в `.gitignore` (он там уже есть ✅)

Все секреты должны быть:
- В `.env.local` (локально)
- В Environment Variables на Vercel/Railway (в production)
- **НИКОГДА** не в Git!

## 📋 Чеклист

- [x] Git репозиторий инициализирован
- [x] .gitignore настроен
- [x] Первый коммит создан
- [ ] Репозиторий создан на GitHub
- [ ] Remote добавлен
- [ ] Код запушен на GitHub

## 🚀 После push на GitHub

1. Подключи к Vercel (см. [DEPLOY.md](./DEPLOY.md))
2. Подключи к Railway (см. [DEPLOY.md](./DEPLOY.md))
3. Настрой автоматический деплой
4. Готово! 🎉

