export function split(separator, str) {
    if (str === undefined)
        return (str) => split(separator, str);
    return str.split(separator);
}
export function join(separator, arr) {
    if (arr === undefined)
        return (arr) => join(separator, arr);
    return arr.join(separator);
}
export function reverse(items) {
    if (typeof items === 'string') {
        return items.split('').reverse().join('');
    }
    const result = [];
    for (let i = items.length - 1; i >= 0; i--) {
        result.push(items[i]);
    }
    return result;
}
//# sourceMappingURL=string.js.map