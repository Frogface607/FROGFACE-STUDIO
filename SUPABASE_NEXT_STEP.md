# ✅ Supabase готов! Следующий шаг

## 📋 Что делать дальше

### Шаг 1: Проверить таблицу (1 минута)

1. В Supabase Dashboard → **Table Editor** (иконка таблицы слева)
2. Должна появиться таблица `knowledge_items`
3. Кликни на неё — увидишь структуру: `id`, `content`, `namespace`, `embedding`, `metadata`, `created_at`

### Шаг 2: Получить API ключи (2 минуты)

1. В Dashboard → **Settings** (шестерёнка слева внизу)
2. Выбери **API** в меню
3. Найди секцию **Project API keys**

**Скопируй:**
- **Project URL** → это `SUPABASE_URL`
  - Пример: `https://xxxxx.supabase.co`
  
- **service_role key** (секретный!) → это `SUPABASE_SERVICE_KEY`
  - Используется для backend
  - ⚠️ **НЕ ПУБЛИКУЙ** в открытом доступе!

- **anon public key** (опционально) → для frontend
  - Можно публиковать, но лучше через environment variables

### Шаг 3: Добавить в .env.local

Открой файл `.env.local` в корне проекта и добавь:

```env
# Supabase
SUPABASE_URL=https://твой-project-id.supabase.co
SUPABASE_SERVICE_KEY=твой-service-role-key
```

Замени на реальные значения из Supabase Dashboard!

### Шаг 4: Сообщи мне ключи

Когда добавишь в `.env.local`, я:
1. Обновлю `knowledge-base` для работы с Supabase
2. Протестирую подключение
3. Помогу мигрировать существующие данные (если есть)

---

**Выполни шаги 1-3 и сообщи когда готово!** 🚀

