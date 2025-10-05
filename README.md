# logging-proxy

Логгирующий proxy для наблюдения за вызовами сервисов в режиме разработки

## Установка

```bash
pnpm add @budarin/logging-proxy
```

## Использование

```typescript
import { createLoggingProxy } from '@budarin/logging-proxy';

...

export const service = isDevelopment
    ? createLoggingProxy<Service>(serviceInstance, logger)
    : serviceInstance;

```

При вызове сервиса в любом месте кода в консоли появится

```js
 <serviceMethodName>(<params>);
```

## Лицензия

MIT
