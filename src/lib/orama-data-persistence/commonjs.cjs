"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    persist: ()=>persist,
    restore: ()=>restore,
    persistToFile: ()=>persistToFile,
    restoreFromFile: ()=>restoreFromFile,
    requireOramaPluginDataPersistence: ()=>requireOramaPluginDataPersistence
});
let _esmRestore;
let _esmPersist;
let _esmRestoreFromFile;
let _esmPersistToFile;
async function persist(...args) {
    if (!_esmPersist) {
        const imported = await import('./index.js');
        _esmPersist = imported.persist;
    }
    return _esmPersist(...args);
}
async function restore(...args) {
    if (!_esmRestore) {
        const imported = await import('./index.js');
        _esmRestore = imported.restore;
    }
    return _esmRestore(...args);
}
function persistToFile(...args) {
    if (!_esmPersistToFile) {
        const imported = require('./index.js');
        _esmPersistToFile = imported.persistToFile;
    }
    return _esmPersistToFile(...args);
}
function restoreFromFile(...args) {
    if (!_esmRestoreFromFile) {
        const imported = require('./index.js');
        _esmRestoreFromFile = imported.restoreFromFile;
    }
    return _esmRestoreFromFile(...args);
}
function requireOramaPluginDataPersistence(callback) {
    import('./index.js').then((loaded)=>setTimeout(()=>callback(undefined, loaded), 1)).catch((error)=>setTimeout(()=>callback(error), 1));
}

//# sourceMappingURL=commonjs.js.map