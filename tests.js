var testReduce = _.reduce(function(memo, item){ return memo + item; }, '');
var testReduceObject = _.reduce(function(memo, item, index){ return memo + index + item; }, '');

function simple (a, b, c)
{
    return a + b + c;
}


function testFilter(items)
{
    return _.filter(function(item, index){
        return item == 'test';
    }, items);
}

var suite =
{
    map: [
        [
            'Array: the first item should be equal to "tset"',
            _.map(_.reverse)(testArray)[0],
            'tset'
        ],
        [
            'Array: the resulting array length should be the same',
            _.map(_.reverse)(testArray).length,
            testArray.length
        ],
        [
            'Object: the first item should be equal to "tset"',
            _.map(_.reverse)(testObject)[0],
            'tset'
        ]
    ],
    mapObj: [
        [
            'Object: the first item at key "key1" be equal to "tset"',
            _.mapObj(_.reverse)(testObject)['key1'],
            'tset'
        ]
    ],
    compose: [
        [
            'The composition should return "tset"',
           _.compose(_.reverse, _.prop('key1'))(testObject),
            'tset'
        ]
    ],
    pipe: [
        [
            'The composition should return "tset"',
           _.pipe(_.prop('key1'), _.reverse)(testObject),
            'tset'
        ]
    ],
    reverse: [
        [
            'Array: the first item should be equal to "hi,hello,test"',
            _.reverse(testArray)[0],
            'hi'
        ],
        [
            'String: "test" reversed should be "tset"',
            _.reverse('test'),
            'tset'
        ],
    ],
    reduce: [
        [
            'Array: the first item should be equal to "testhellohi"',
            testReduce(testArray),
            'testhellohi'
        ],
        [
            'Object: the first item should be equal to "testhellohi"',
            testReduceObject(testObject),
            'key1testkey2hellokey3hi'
        ]
    ],
    filter: [
        [
            'Array: the content of the the first element should be "test"',
            testFilter(testArray)[0],
            'test'
        ],
        [
            'Array: the length of the array should be 1 after filter is applied',
            testFilter(testArray).length,
            1
        ],
        [
            'Object: The content of the the first element should be "test"',
            testFilter(testObject)[0],
            'test'
        ],
        [
            'Object: the length of the array should be 1',
            testFilter(testObject).length, 1
        ],
    ],
    curry: [
        [
            'The result should be "abc"',
            _.curry(simple)('a', 'b', 'c'),
            'abc'
        ],
        [
            'The result should be "abc"',
            _.curry(simple)('a', 'b')('c'),
            'abc'
        ],
        [
            'The result should be "abc"',
            _.curry(simple)('a')('b', 'c'),
            'abc'
        ],
    ],
    prop: [
        [
            'Object: the value of key1 should be "test"',
            _.prop('key1')(testObject),
            'test'
        ]
    ],
    invoke: [
        [
            'The first item should be uppercase',
            _.invoke(String.prototype.toUpperCase)(testArray)[0],
            'TEST'
        ]
    ],
    propEq: [
        [
            'The length of the search should be 1',
            _.filter(_.propEq('name', 'Jenny'))(testComplexArray).length,
            1
        ]
    ],
    or: [
        [
            'The length of the or search should be 4',
            _.filter
            (
                _.or
                (
                    _.propEq('gender', 'male'),
                    _.propEq('name', 'Jenny')
                )
            )(testComplexArray).length,
            5
        ]
    ],
    and: [
        [
            'The length of the and search should be 1',
            _.filter
            (
                _.and
                (
                    _.propEq('gender', 'male'),
                    _.propEq('name', 'Eric'),
                    _.propEq('country', 'United States')
                )
            )(testComplexArray).length,
            1
        ]
    ],
    match: [
        [
            'The length of the and search should be 1',
            _.match
            (
                {
                    gender: 'male',
                    name: 'Eric',
                    country: 'United States'
                }
            )(testComplexArray).length,
            1
        ]
    ],
    groupBy: [
        [
            'The length of the France search should be 2',
            _.groupBy(_.prop('country'))(testComplexArray)['France'].length,
            2
        ]
    ],
    countBy: [
        [
            'The length of the France search should be 2',
            _.countBy(_.prop('country'))(testComplexArray)['France'],
            2
        ]
    ],

};
my_unit.run('nano.js test suite', suite);
