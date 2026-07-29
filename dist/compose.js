function applyRight(funcs, ...args) {
    let i = funcs.length;
    let result = args;
    while (i--) {
        result = [funcs[i].apply(this, result)];
    }
    return result[0];
}
function applyLeft(funcs, ...args) {
    let result = args;
    for (let i = 0; i < funcs.length; i++) {
        result = [funcs[i].apply(this, result)];
    }
    return result[0];
}
export function compose(...funcs) {
    return function this_(...args) {
        return applyRight.call(this, funcs, ...args);
    };
}
export function pipe(...funcs) {
    return function this_(...args) {
        return applyLeft.call(this, funcs, ...args);
    };
}
export function or(...predicates) {
    return function this_(...args) {
        for (let i = 0; i < predicates.length; i++) {
            if (predicates[i].apply(this, args))
                return true;
        }
        return false;
    };
}
export function and(...predicates) {
    return function this_(...args) {
        for (let i = 0; i < predicates.length; i++) {
            if (!predicates[i].apply(this, args))
                return false;
        }
        return true;
    };
}
//# sourceMappingURL=compose.js.map