export type Logger = {
    info: (...data: unknown[]) => void;
    warn: (...data: unknown[]) => void;
    error: (...data: unknown[]) => void;
    debug: (...data: unknown[]) => void;
} & Record<string, any>;

export function createLoggingProxy<T extends object>(
    target: T,
    logger: Logger
): T {
    return new Proxy(target, {
        get(targetObj, prop, receiver): unknown {
            const orig = Reflect.get(targetObj, prop, receiver);

            if (typeof orig === 'function') {
                return function (...args: unknown[]) {
                    const result = orig.apply(targetObj, args) as unknown;
                    logger.debug(
                        `${String(prop)}${JSON.stringify(args).replace('[', '(').replace(']', ')')} => ${JSON.stringify(result)}    `
                    );

                    return result;
                };
            }
            return orig;
        },
    });
}
