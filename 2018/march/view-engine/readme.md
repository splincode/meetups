## Angular JIT vs AOT 

Chrome timeline perfomance
![](https://habrastorage.org/webt/ov/1y/5m/ov1y5mfimskkisme7kewdrailmy.jpeg)

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
cd angular4
npm install

# JIT Compilation
npm run build:prod
cd dist && httpserver

# AOT Compilation
npm run build:aot:prod
cd dist && httpserver
```

Перейдите по адресу: localhost:8000, откройте Chrome Dev Tools на вкладке perfomance и запустите несколько раз страницу, чтобы посмотреть средние результаты загрузки

### Angular 5+

Usage AOT `ng build --aot --prod` or JIT `ng build --no-aot --prod --build-optimizer false`

### Примечание
* Я устанавливал себе глобально httpserver
* В версии Angular 2 сборка падает, однако, файлы успешно компилируются, после чего можно запускать локальный веб-сервер (проблема решилась в Angular 4)