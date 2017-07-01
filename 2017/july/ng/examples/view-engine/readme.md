## Angular JIT vs AOT

```bash
cd angular4 # cd angular2 
npm install
```

### JIT

```
npm run build:prod
cd dist && httpserver # install global npm package
```


### AOT

```
npm run build:aot:prod
cd dist && httpserver # install global npm package
```

### Примечание

В версии Angular 2 сборка падает, однако, файлы успешно компилируются, после чего можно запускать локальный веб-сервер (проблема решилась в Angular 4)