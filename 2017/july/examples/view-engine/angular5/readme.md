# Angular5

```bash
npm install
npm install -g http-server
```

## AOT mode

```bash
ng build --aot --prod
cd dist/
http-server
# open in browser http://127.0.0.1:8081
```

![](https://habrastorage.org/webt/_u/8r/g_/_u8rg_tlgmmfjmcvxay8mxy98pi.png)

## JIT mode (Problem)

```bash
ng build --no-aot --prod
cd dist/
http-server
# open in browser http://127.0.0.1:8081
```

```text
main.c90f048daaa26da75376.bundle.js:1 Uncaught Error: Unexpected value 't' imported by the module 't'. Please add a @NgModule annotation.
    at p (main.c90f048daaa26da75376.bundle.js:1)
    at main.c90f048daaa26da75376.bundle.js:1
    at Array.forEach (<anonymous>)
    at t.getNgModuleMetadata (main.c90f048daaa26da75376.bundle.js:1)
    at t._loadModules (main.c90f048daaa26da75376.bundle.js:1)
    at t._compileModuleAndComponents (main.c90f048daaa26da75376.bundle.js:1)
    at t.compileModuleAsync (main.c90f048daaa26da75376.bundle.js:1)
    at t.compileModuleAsync (main.c90f048daaa26da75376.bundle.js:1)
    at t.LMZF.t.bootstrapModule (main.c90f048daaa26da75376.bundle.js:1)
    at Object.cDNt (main.c90f048daaa26da75376.bundle.js:1)
```


## JIT mode (Fix Problem)

```bash
ng build --prod --aot=false --build-optimizer=false
cd dist/
http-server
# open in browser http://127.0.0.1:8081
```

![](https://habrastorage.org/webt/_u/8r/g_/_u8rg_tlgmmfjmcvxay8mxy98pi.png)