export function enableLogs(debugConfig: any): void;
export namespace logger {
    export { noop as trace };
    export { noop as debug };
    export { noop as log };
    export { noop as warn };
    export { noop as info };
    export { noop as error };
}
declare function noop(...args: any[]): void;
export {};
