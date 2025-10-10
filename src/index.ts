export interface Logger {
    info: (...data: unknown[]) => void;
    warn: (...data: unknown[]) => void;
    error: (...data: unknown[]) => void;
    debug: (...data: unknown[]) => void;
    [key: string]: unknown;
}

export function createLoggingProxy<T extends object>(
    target: T,
    logger: Logger
): T {
    return new Proxy(target, {
        get(targetObj, prop, receiver): unknown {
            const orig = Reflect.get(targetObj, prop, receiver);

            if (typeof orig === 'function') {
                return function (...args: unknown[]) {
                    logger.debug(
                        `${String(prop)}${JSON.stringify(args).replace('[', '(').replace(']', ')')}`
                    );
                    return orig.apply(targetObj, args) as unknown;
                };
            }
            return orig;
        },
    });
}
