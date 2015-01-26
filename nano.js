var _ = (function () {
    var self = {};

    function sub_curry(fn /*, variable number of args */) {
        var args = [].slice.call(arguments, 1);
        return function () {
            return fn.apply(this, args.concat([].slice.call(arguments)));
        };
    };

    self.curry = function(fn, length)
    {
        // capture fn's # of parameters
        length = length || fn.length;
        return function () {
            if (arguments.length < length) {
                // not all arguments have been specified. Curry once more.
                var combined = [fn].concat([].slice.call(arguments));
                return length - arguments.length > 0
                    ? self.curry(sub_curry.apply(this, combined), length - arguments.length)
                    : sub_curry.call(this, combined );
            } else {
                // all arguments have been specified, actually call function
                return fn.apply(this, arguments);
            }
        };
    };

    self.each = self.curry(function(fn, items)
    {
        for (var i in items)
        {
            fn(items[i], i);
        }
    });

    self.compose = self.curry(function(/*variable number of args */) {
        var funcs = arguments;
        return function() {
            var args = arguments,
            length = funcs.length;
            while (length--)
            {
                args = [funcs[length].apply(this, args)];
            }
            return args[0];
        };
    });

    self.pipe = self.curry(function(/*variable number of args */) {
        return _.compose.apply(this, _.reverse(arguments));
    });


    self.or = self.curry(function(/*variable number of args */)
    {
        var funcs = arguments;
        return function() {
            var args = arguments,
            length = funcs.length;
            while (length--)
            {
                if (funcs[length].apply(this, args))
                {
                    return true;
                }
            }
            return false;
        };
    });

    self.and = self.curry(function(/*variable number of args */)
    {
        var funcs = arguments;
        return function() {
            var args = arguments,
            length = funcs.length;
            while (length--)
            {
                if (!funcs[length].apply(this, args))
                {
                    return false;
                }
            }
            return true;
        };
    });

    self.where = self.curry(function(searchObject, items)
    {
        return self.and.apply
        (
            self,
            self.map(self.propEqInv, searchObject)
        )(items);
    });

    self.match = self.curry(function(searchObject, items)
    {
        return _.filter(self.where(searchObject))(items);
    });

    self.groupBy = self.curry(function(fn, items)
    {
        var ret = {};
        _.each(function(item){
            if (!ret[fn(item)])
            {
                ret[fn(item)] = [];
            }
            ret[fn(item)].push(item);

        }, items)
        return ret;
    });

    self.countBy = self.curry(function(fn, items)
    {
        var ret = {};
        _.each(function(value, key){ret[key] = value.length;}, _.groupBy(fn, items));
        return ret;
    });

    self.length = function(items)
    {
        return items.length
    };

    self.reverse = function(items)
    {
        if (typeof items == 'string')
        {
            return _.compose(_.join(''), _.reverse, _.split(''))(items);
        }
        var ret = [];
        _.each(function(item, index){
            ret.push(items[items.length - index - 1]);
        }, items);
        return ret;
    };

    self.split = self.curry(function (sep, str)
    {
        return str.split(sep);
    });

    self.join = self.curry(function (sep, str)
    {
        return str.join(sep);
    });

    self.propEq = self.curry(function(key, value, items)
    {
        return items[key] == value;
    });
    self.propEqInv = self.curry(function(value, key, items)
    {
        return items[key] == value;
    });

    self.prop = self.curry(function(key, items)
    {
        return items[key];
    });

    self.log = self.curry(function(items)
    {
        console.log(items);
        return items;
    });

    self.map = self.curry(function(fn, items)
    {
        var ret = [];
        _.each(function(item, index){
            ret.push(fn(item, index));
        }, items);
        return ret;
    });

    self.mapObj = self.curry(function(fn, items)
    {
        var ret = {};
        _.each(function(item, index){
            ret[index] = fn(item, index);
        }, items);
        return ret;
    });

    self.invoke = self.curry(function(fn, items)
    {
        return _.map(function(item){
            return fn.call(item);
        }, items);
    });

    self.reduce = self.curry(function(fn, memo, items)
    {
        self.each(function(item, index)
        {
            memo = fn(memo, item, index);
        }, items);
        return memo;
    });

    self.sum = self.reduce(function(memo, item){return memo + item;}, 0);

    self.filter = self.curry(function(fn, items)
    {
        var ret = [];
        _.each(function(item, index){
            if (fn(item, index))
            {
                ret.push(item);
            }
        }, items);
        return ret;
    });

    return self;
}());
