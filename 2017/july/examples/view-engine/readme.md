## Angular JIT vs AOT


### Angular 2
```bash
cd angular2
npm install

# JIT Compilation
npm run build:prod
cd dist && httpserver

# AOT Compilation
npm run build:aot:prod
cd dist && httpserver
```

### Angular 4
```bash
cd angular2
npm install

# JIT Compilation
npm run build:prod
cd dist && httpserver

# AOT Compilation
npm run build:aot:prod
cd dist && httpserver
```

Перейдите по адресу: localhost:8000, откройте Chrome Dev Tools на вкладке perfomance и запустите несколько раз страницу, чтобы посмотреть средние результаты загрузки


### Примечание
* Я устанавливал себе глобально httpserver
* В версии Angular 2 сборка падает, однако, файлы успешно компилируются, после чего можно запускать локальный веб-сервер (проблема решилась в Angular 4)