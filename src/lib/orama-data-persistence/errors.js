function capitalize(word) {
    return `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`;
}
export function UNSUPPORTED_FORMAT(format) {
    return `Unsupported serialization format: ${format}`;
}
export function FILESYSTEM_NOT_SUPPORTED_ON_RUNTIME(runtime) {
    return `Filesystem access is not supported on ${capitalize(runtime)}`;
}
export function METHOD_MOVED(method) {
    return `Function ${method} has been moved to the "/server" module. \n\nImport it via "import { ${method} } from 'orama/plugin-data-persistence/server'". \n\nRead more at https://docs.oramasearch.com/open-source/plugins/plugin-data-persistence.`;
}

//# sourceMappingURL=errors.js.map