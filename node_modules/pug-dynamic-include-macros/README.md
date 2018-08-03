# Pug Dynamic Include Macros

This is a small utility (with no dependencies!) for node, to create a file containing mixins for all of the files in a given directory. This was created in order to build a small, lightweight flat-file static site generator using pug as a template engine. If you have found yourself running up against pug's lack of support for being able to include (for example) all of the partials in a given directory, this might be a solution.

## Installing:

just run `npm install --save-dev pug-dynamic-include-macros`

If you are using this inside of brunch, put this in the "preCompile" lifecycle hook:

```javascript
// brunch-config.js
exports.hooks = {
  preCompile() {
    require('pug-dynamic-include-macros')({
      directories: [
        {
          name: 'mixinNamePrefix',
          root: 'app/'
          directory: 'app/content/something',
          filter: ':markdown-it',
          sortFunc: function(a,b) {
            return a > b
          }
        }
      ],
      "mixinFileName": "_dynamicincludes.pug"
    })
  }
}
```

## Options

The main function takes a configuration object.
That object takes two parameters (both required):

### directories

An array of objects with the following parameters:

name *string* __required__: the name of the include mixin that will be generated. All of the individual mixins generated will be in the form `${name}${iterator}`

directory *string* __required__: the path to the directory (can use path() function) that you want to use to generate a mixin from

filter *string* __optional__: a filter string (beginning with `:`) to append to the include.

root *string* __optional__: a part of the path to remove from the actual includes. Useful if the target mixin file is in a subdirectory.

sortFunc: *function* __optional__: a sort function. It will be passed only the filenames (though if you absolutely need to load the full files to sort, you can do that here using node fs.). This is a place you can specify reverse order if you need it, or normalize for things like missing leading zeros.

### mixinFileName

The name of the file to write. This file will be totally overwritten by this module, so its best to include it as something else in a partial template.

## Return

This module's function returns a promise. The promise is resolved with the text of the outputted file, as well as the configuration object.
