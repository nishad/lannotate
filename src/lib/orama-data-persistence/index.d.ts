/// <reference types="node" />
import type { AnyOrama } from '@orama/orama';
import type { PersistenceFormat, Runtime } from './types.js';
export declare function persist<T extends AnyOrama>(db: T, format?: PersistenceFormat, runtime?: Runtime): Promise<string | Buffer>;
export declare function restore<T extends AnyOrama>(format: PersistenceFormat, data: string | Buffer, runtime?: Runtime): Promise<T>;
export declare function persistToFile<T extends AnyOrama>(db: T, format?: PersistenceFormat, path?: string, runtime?: Runtime): Promise<never>;
export declare function restoreFromFile<T extends AnyOrama>(format?: PersistenceFormat, path?: string, runtime?: Runtime): Promise<never>;
