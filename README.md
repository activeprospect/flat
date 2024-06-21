# flat

> [!NOTE]
> Originally forked to fix a bug where dot notation keys in a nested array were not unflattened,
> see https://github.com/activeprospect/flat/commit/27b5bfaaab986028dd9d8bb8027d5dce2e5a874b.
>
> Fork is maintained because LeadConduit is not set up to easily consume ES modules, and the
> upstream package only ships an ESM package. This lib contains equivalent code, but maintains
> a CommonJS file format for compatibility with all LeadConduit integrations and applications.

Take a nested Javascript object and flatten it, or unflatten an object with
delimited keys.

## Installation

``` bash
$ npm install flat
```

## Methods

### flatten(original, options)

Flattens the object - it'll return an object one level deep, regardless of how
nested the original object was:

``` javascript
const { flatten } = require('flat')

flatten({
    key1: {
        keyA: 'valueI'
    },
    key2: {
        keyB: 'valueII'
    },
    key3: { a: { b: { c: 2 } } }
})

// {
//   'key1.keyA': 'valueI',
//   'key2.keyB': 'valueII',
//   'key3.a.b.c': 2
// }
```

### unflatten(original, options)

Flattening is reversible too, you can call `unflatten` on an object:

``` javascript
const { unflatten } = require('flat')

unflatten({
    'three.levels.deep': 42,
    'three.levels': {
        nested: true
    }
})

// {
//     three: {
//         levels: {
//             deep: 42,
//             nested: true
//         }
//     }
// }
```

## Options

### delimiter

Use a custom delimiter for (un)flattening your objects, instead of `.`.

### safe

When enabled `flatten` will preserve arrays and their contents. This is disabled by default.

``` javascript
const { flatten } = require('flat')

flatten({
    this: [
        { contains: 'arrays' },
        { preserving: {
              them: 'for you'
        }}
    ]
}, {
    safe: true
})

// {
//     'this': [
//         { contains: 'arrays' },
//         { preserving: {
//             them: 'for you'
//         }}
//     ]
// }
```

### object

When enabled, arrays will not be created automatically when calling unflatten, like so:

``` javascript
unflatten({
    'hello.you.0': 'ipsum',
    'hello.you.1': 'lorem',
    'hello.other.world': 'foo'
}, { object: true })

// hello: {
//     you: {
//         0: 'ipsum',
//         1: 'lorem',
//     },
//     other: { world: 'foo' }
// }
```

### overwrite

When enabled, existing keys in the unflattened object may be overwritten if they cannot hold a newly encountered nested value:

```javascript
unflatten({
    'TRAVIS': 'true',
    'TRAVIS.DIR': '/home/travis/build/kvz/environmental'
}, { overwrite: true })

// TRAVIS: {
//     DIR: '/home/travis/build/kvz/environmental'
// }
```

Without `overwrite` set to `true`, the `TRAVIS` key would already have been set to a string, thus could not accept the nested `DIR` element.

This only makes sense on ordered arrays, and since we're overwriting data, should be used with care.


### maxDepth

Maximum number of nested objects to flatten.

``` javascript
const { flatten } = require('flat')

flatten({
    key1: {
        keyA: 'valueI'
    },
    key2: {
        keyB: 'valueII'
    },
    key3: { a: { b: { c: 2 } } }
}, { maxDepth: 2 })

// {
//   'key1.keyA': 'valueI',
//   'key2.keyB': 'valueII',
//   'key3.a': { b: { c: 2 } }
// }
```

### transformKey

Transform each part of a flat key before and after flattening.

```javascript
const { flatten, unflatten } = require('flat')

flatten({
    key1: {
        keyA: 'valueI'
    },
    key2: {
        keyB: 'valueII'
    },
    key3: { a: { b: { c: 2 } } }
}, {
    transformKey: function(key){
      return '__' + key + '__';
    }
})

// {
//   '__key1__.__keyA__': 'valueI',
//   '__key2__.__keyB__': 'valueII',
//   '__key3__.__a__.__b__.__c__': 2
// }

unflatten({
      '__key1__.__keyA__': 'valueI',
      '__key2__.__keyB__': 'valueII',
      '__key3__.__a__.__b__.__c__': 2
}, {
    transformKey: function(key){
      return key.substring(2, key.length - 2)
    }
})

// {
//     key1: {
//         keyA: 'valueI'
//     },
//     key2: {
//         keyB: 'valueII'
//     },
//     key3: { a: { b: { c: 2 } } }
// }
```

## Command Line Usage

`flat` is also available as a command line tool. You can run it with [`npx`](https://docs.npmjs.com/cli/v8/commands/npx):

```sh
npx flat foo.json
```

Or install the `flat` command globally:
 
```sh
npm i -g flat && flat foo.json
```

Accepts a filename as an argument:

```sh
flat foo.json
```

Also accepts JSON on stdin:

```sh
cat foo.json | flat
```
