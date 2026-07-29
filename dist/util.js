export function prop(key, obj) {
    if (obj === undefined)
        return (obj) => prop(key, obj);
    return obj[key];
}
export function propEq(key, value, obj) {
    if (obj === undefined)
        return (obj) => propEq(key, value, obj);
    return obj[key] == value;
}
export function propEqInv(value, key, obj) {
    if (obj === undefined)
        return (obj) => propEqInv(value, key, obj);
    return obj[key] == value;
}
export function log(item) {
    console.log(item);
    return item;
}
export function length(items) {
    return items.length;
}
export function sum(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i];
    }
    return total;
}
//# sourceMappingURL=util.js.map