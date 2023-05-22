### smevsign-web, vue3: Демонстрация api сервиса smevsign: формирования и подписания xml для СМЭВ3 [ https://github.com/noadavis/smevsign ]

[![title.png](title.png)](#title)

### Установка зависимостей
```
npm install
```

### Запуск в режиме разработки
```
npm run serve
```

### Сборка проекта для публикации, в папку dist
```
npm run build
```

### Настройка nginx для smevsign и smevsign-web
- Настраиваем [smevsign](https://github.com/noadavis/smevsign) tomcat согласно инструкции проекта
- Копируем production build [npm run build] в папку /home/dev/dist на сервере
- Изменяем пользователя nginx в /etc/nginx/nginx.conf [ user dev; ]
- Копируем конфиг config/nginx/default в /etc/nginx/sites-enabled/default

### Bootstrap 5 theme
Mazer: https://github.com/zuramai/mazer
