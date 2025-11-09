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
    function createProxy(obj: object, currentPath: string[]): any {
        return new Proxy(obj, {
            get(targetObj, prop): unknown {
                // Убираем receiver - используем только target и prop
                const orig = targetObj[prop as keyof typeof targetObj];
                const newPath = [...currentPath, String(prop)];

                if (typeof orig === 'function') {
                    return function (...args: unknown[]) {
                        // Привязываем this к оригинальному объекту
                        const result = (orig as Function).apply(
                            targetObj,
                            args
                        ) as unknown;
                        const pathStr = newPath.join('.');
                        logger.debug(
                            `${pathStr}${JSON.stringify(args).replace('[', '(').replace(']', ')')} => ${JSON.stringify(result)}`
                        );

                        if (result !== null && typeof result === 'object') {
                            return createProxy(result, newPath);
                        }

                        return result;
                    };
                }

                if (orig !== null && typeof orig === 'object') {
                    return createProxy(orig, newPath);
                }

                return orig;
            },
        });
    }

    return createProxy(target, []);
}
