function subCurry(fn, ...args) {
    return function this_(...inner) {
        return fn.apply(this, args.concat(inner));
    };
}
export function curry(fn, arity) {
    const len = arity ?? fn.length;
    return function this_(...args) {
        if (args.length < len) {
            return curry(subCurry(fn, ...args), len - args.length);
        }
        return fn.apply(this, args);
    };
}
//# sourceMappingURL=curry.js.map