# 🦆 ClickQuest

**ClickQuest** - это современный сервис сокращения ссылок с уникальной системой заданий для пользователей. Аналог SetQuest с открытым исходным кодом.

## ✨ Особенности

- 🔗 **Короткие ссылки** - Превращаем длинные URL в компактные ссылки через надежный API is.gd
- 📋 **Задания для пользователей** - Добавляйте задания: посетить сайт, YouTube канал или соцсеть
- ✅ **Проверка выполнения** - Задания проверяются автоматически, скип невозможен
- 🦆 **Утка следит за вами** - Оригинальная утка из Telegram плачет, если нарушить правила
- 📊 **Статистика переходов** - Отслеживайте количество кликов по вашим ссылкам
- 🛡️ **Безопасность** - Проверка ссылок и защита от злоупотреблений

## 🚀 Быстрый старт

### Требования

- Node.js >= 14.x
- npm >= 6.x

### Установка

```bash
# Клонируйте репозиторий
git clone https://github.com/yourusername/clickquest.git
cd clickquest

# Установите зависимости
npm install

# Запустите приложение
npm start
```

Приложение будет доступно по адресу: http://localhost:3000

## 📖 Документация

### Страницы

- **Главная** (`/`) - Лендинг с описанием сервиса
- **Создать** (`/create`) - Создание новой короткой ссылки с заданием
- **FAQ** (`/faq`) - Часто задаваемые вопросы
- **Docs** (`/docs`) - Техническая документация
- **Условия использования** (`/terms`) - Правила сервиса
- **Политика конфиденциальности** (`/privacy`) - Политика обработки данных

### API

#### Создать ссылку

```http
POST /api/create
Content-Type: application/json

{
  "longUrl": "https://example.com/very-long-url",
  "taskType": "website",
  "taskUrl": "https://example.com/task",
  "taskDescription": "Посетите наш сайт"
}
```

Ответ:
```json
{
  "success": true,
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/link/abc123",
  "taskId": "uuid-here"
}
```

#### Получить информацию о ссылке

```http
GET /api/link/:shortCode
```

#### Проверить выполнение задания

```http
POST /api/verify-task
Content-Type: application/json

{
  "taskId": "uuid-here"
}
```

#### Отследить клик

```http
POST /api/track-click
Content-Type: application/json

{
  "shortCode": "abc123"
}
```

### Типы заданий

- `website` - посещение веб-сайта
- `youtube` - подписка на YouTube канал
- `social` - переход в социальную сеть (VK, Telegram, etc.)

## 🏗️ Архитектура

```
clickquest/
├── app.js                 # Точка входа приложения
├── .env                   # Переменные окружения
├── package.json           # Зависимости и скрипты
├── src/
│   ├── routes/
│   │   ├── main.js        # Основные маршруты
│   │   └── api.js         # API маршруты
│   ├── models/            # Модели данных
│   ├── middleware/        # Промежуточное ПО
│   └── utils/             # Утилиты
├── views/
│   ├── pages/             # Страницы приложения
│   └── partials/          # Части страниц
├── public/
│   ├── css/
│   │   └── style.css      # Стили приложения
│   └── js/
│       ├── main.js        # Основной JavaScript
│       ├── create.js      # Логика создания ссылок
│       ├── link.js        # Логика страницы ссылки
│       └── task.js        # Логика страницы задания
└── data/
    └── links.json         # Хранилище данных
```

## 🔧 Конфигурация

Создайте файл `.env` в корне проекта:

```env
PORT=3000
NODE_ENV=development
API_KEY=is.gd
```

## 🦆 Как работает утка?

Утка - это фирменная фишка ClickQuest:

- **Нормальное состояние** 🦆 - утка довольна и прыгает
- **Плачущая утка** 🦆😢 - появляется, если пользователь пытается пропустить задание или уйти раньше времени
- **Довольная утка** 🦆✨ - показывается после успешного выполнения задания

## 📝 Лицензия

ISC

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте ветку (`git checkout -b feature/amazing-feature`)
3. Commit ваши изменения (`git commit -m 'Add some amazing feature'`)
4. Push в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📞 Контакты

- Email: support@clickquest.ru
- GitHub: [yourusername](https://github.com/yourusername)

## 🙏 Благодарности

- inspired by SetQuest (закрытый проект)
- API сокращения ссылок: [is.gd](https://is.gd)
- Утка из Telegram ❤️

---

**ClickQuest** © 2024. Все права защищены.
