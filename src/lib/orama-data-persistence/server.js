import { FILESYSTEM_NOT_SUPPORTED_ON_RUNTIME } from './errors.js';
import { persist, restore } from './index.js';
import { detectRuntime } from './utils.js';
export const DEFAULT_DB_NAME = `orama_bump_${+new Date()}`;
let _fs;
export async function persistToFile(db, format = 'binary', path, runtime) {
    if (!runtime) {
        runtime = detectRuntime();
    }
    if (!_fs) {
        _fs = await loadFileSystem(runtime);
    }
    if (!path) {
        path = await getDefaultOutputFilename(format, runtime);
    }
    const serialized = await persist(db, format, runtime);
    await _fs.writeFile(path, serialized);
    return path;
}
export async function restoreFromFile(format = 'binary', path, runtime) {
    if (!runtime) {
        runtime = detectRuntime();
    }
    if (!_fs) {
        _fs = await loadFileSystem(runtime);
    }
    if (!path) {
        path = await getDefaultOutputFilename(format, runtime);
    }
    const data = await _fs.readFile(path);
    return restore(format, data, runtime);
}
async function loadFileSystem(runtime) {
    switch(runtime){
        case 'node':
            {
                const { readFile , writeFile  } = await import('node:fs/promises');
                const { resolve  } = await import('node:path');
                return {
                    cwd: process.cwd,
                    resolve,
                    readFile: readFile,
                    writeFile: writeFile
                };
            }
        /* c8 ignore next 13 */ case 'deno':
            {
                // @ts-expect-error Deno allows TS imports
                const { resolve  } = await import('https://deno.land/std/path/mod.ts');
                // @ts-expect-error Deno is only available in Deno
                const { cwd , readTextFile: readFile , writeTextFile: writeFile  } = Deno;
                return {
                    cwd: cwd,
                    resolve: resolve,
                    readFile: readFile,
                    writeFile: writeFile
                };
            }
        default:
            throw new Error(FILESYSTEM_NOT_SUPPORTED_ON_RUNTIME(runtime));
    }
}
async function getDefaultOutputFilename(format, runtime) {
    if (!_fs) {
        _fs = await loadFileSystem(runtime);
    }
    return _fs.resolve(_fs.cwd(), await getDefaultFileName(format, runtime));
}
export async function getDefaultFileName(format, runtime) {
    if (!runtime) {
        runtime = detectRuntime();
    }
    let extension;
    switch(format){
        case 'json':
            extension = 'json';
            break;
        case 'dpack':
            extension = 'dpack';
            break;
        case 'binary':
            extension = 'msp';
    }
    let dbName = DEFAULT_DB_NAME;
    /* c8 ignore next 3 */ if (runtime === 'deno') {
        // @ts-expect-error Deno is only available in Deno
        dbName = Deno.env.get('ORAMA_DB_NAME') ?? DEFAULT_DB_NAME;
    } else {
        var _process_env;
        dbName = (process === null || process === void 0 ? void 0 : (_process_env = process.env) === null || _process_env === void 0 ? void 0 : _process_env.ORAMA_DB_NAME) ?? DEFAULT_DB_NAME;
    }
    return `${dbName}.${extension}`;
}

//# sourceMappingURL=server.js.map