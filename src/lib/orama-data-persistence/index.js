import { decode, encode } from '@msgpack/msgpack';
import { create, load, save } from '@orama/orama';
// @ts-expect-error dpack does not expose types
// import * as dpack from 'dpack';
import { METHOD_MOVED, UNSUPPORTED_FORMAT } from './errors.js';
import { detectRuntime } from './utils.js';
const hexFromMap = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	a: 10,
	b: 11,
	c: 12,
	d: 13,
	e: 14,
	f: 15
};
const hexToMap = Object.keys(hexFromMap);
/* c8 ignore next 13 */ function slowHexToBuffer(hex) {
	const bytes = new Uint8Array(Math.floor(hex.length / 2));
	hex = hex.toLowerCase();
	for (let i = 0; i < hex.length; i++) {
		const a = hexFromMap[hex[i * 2]];
		const b = hexFromMap[hex[i * 2 + 1]];
		if (a === undefined || b === undefined) {
			break;
		}
		bytes[i] = (a << 4) | b;
	}
	return bytes;
}
/* c8 ignore next 5 */ function slowHexToString(bytes) {
	return Array.from(bytes || [])
		.map((b) => hexToMap[b >> 4] + hexToMap[b & 15])
		.join('');
}
export async function persist(db, format = 'binary', runtime) {
	if (!runtime) {
		runtime = detectRuntime();
	}
	const dbExport = await save(db);
	let serialized;
	switch (format) {
		case 'json':
			serialized = JSON.stringify(dbExport);
			break;
		case 'dpack':
			serialized = dpack.serialize(dbExport);
			break;
		case 'binary':
			{
				const msgpack = encode(dbExport);
				if (runtime === 'node') {
					serialized = Buffer.from(msgpack.buffer, msgpack.byteOffset, msgpack.byteLength);
					serialized = serialized.toString('hex');
					/* c8 ignore next 3 */
				} else {
					serialized = slowHexToString(msgpack);
				}
			}
			break;
		default:
			throw new Error(UNSUPPORTED_FORMAT(format));
	}
	return serialized;
}
export async function restore(format, data, runtime) {
	if (!runtime) {
		runtime = detectRuntime();
	}
	const db = await create({
		schema: {
			__placeholder: 'string'
		}
	});
	let deserialized;
	switch (format) {
		case 'json':
			deserialized = JSON.parse(data.toString());
			break;
		case 'binary':
			if (runtime === 'node') {
				data = Buffer.from(data.toString(), 'hex');
				/* c8 ignore next 3 */
			} else {
				data = slowHexToBuffer(data);
			}
			deserialized = decode(data);
			break;
		default:
			throw new Error(UNSUPPORTED_FORMAT(format));
	}
	await load(db, deserialized);
	return db;
}
export async function persistToFile(db, format = 'binary', path, runtime) {
	throw new Error(METHOD_MOVED('persistToFile'));
}
export async function restoreFromFile(format = 'binary', path, runtime) {
	throw new Error(METHOD_MOVED('restoreFromFile'));
}

//# sourceMappingURL=index.js.map
