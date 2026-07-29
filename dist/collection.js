import { and } from './compose.js';
import { propEqInv } from './util.js';
export function each(fn, items) {
    if (items === undefined)
        return (items) => each(fn, items);
    for (const key in items) {
        if (Object.prototype.hasOwnProperty.call(items, key)) {
            fn(items[key], key);
        }
    }
}
export function map(fn, items) {
    if (items === undefined)
        return (items) => map(fn, items);
    const result = [];
    each((item, index) => { result.push(fn(item, index)); }, items);
    return result;
}
export function mapObj(fn, items) {
    if (items === undefined)
        return (items) => mapObj(fn, items);
    const result = {};
    each((item, key) => { result[key] = fn(item, key); }, items);
    return result;
}
export function filter(predicate, items) {
    if (items === undefined)
        return (items) => filter(predicate, items);
    const result = [];
    each((item, index) => {
        if (predicate(item, index))
            result.push(item);
    }, items);
    return result;
}
export function reduce(fn, memo, items) {
    if (items === undefined)
        return (items) => reduce(fn, memo, items);
    each((item, index) => { memo = fn(memo, item, index); }, items);
    return memo;
}
export function groupBy(fn, items) {
    if (items === undefined)
        return (items) => groupBy(fn, items);
    const result = {};
    each((item) => {
        const key = fn(item);
        if (!result[key])
            result[key] = [];
        result[key].push(item);
    }, items);
    return result;
}
export function countBy(fn, items) {
    if (items === undefined)
        return (items) => countBy(fn, items);
    const groups = groupBy(fn, items);
    const result = {};
    for (const key in groups) {
        if (Object.prototype.hasOwnProperty.call(groups, key)) {
            result[key] = groups[key].length;
        }
    }
    return result;
}
export function invoke(methodName, items) {
    if (items === undefined)
        return (items) => invoke(methodName, items);
    return map((item) => item[methodName].call(item), items);
}
export function where(pattern, item) {
    const predicates = Object.entries(pattern).map(([key, value]) => propEqInv(value, key));
    const predicate = and(...predicates);
    if (item === undefined)
        return predicate;
    return predicate(item);
}
export function match(pattern, items) {
    if (items === undefined)
        return (items) => match(pattern, items);
    return filter(where(pattern), items);
}
//# sourceMappingURL=collection.js.map