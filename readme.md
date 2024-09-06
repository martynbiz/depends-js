# Depends JS

Dependency manager for web pages. Ensures that dependency styles and script are only loaded once, even when multiple scripts rely on the same dependency (e.g. Vue). Provides a dependency manager for CMSs such as Terminalfour that don't have a dependency manager built in. Dependencies can be pulled from CDNs as an alternative to bundling - this is useful when e.g. a page has multiple Vue scripts where Vue is pulled in once from CDN.

## Getting started

```html
<script src="path/to/depends.min.js">
```

Appended scripts will be added to document.body. Appended styles will be added to document.head.

## Register dependencies

This should be run before we load any scripts with dependencies. They must be registered first.

Register a single dependency for other scripts to reference. When a string is the only value, it will assume this is the script src with no dependencies:

```javascript
depends.register({
  "vue@3": "https://unpkg.com/vue@3/dist/vue.global.js",
});
```

More advanced configuration where registered dependency has multiple scripts and styles

```javascript
depends.register({
  ...
  "accessible-slick@1.0": {
    "style": [
      "//cdn.jsdelivr.net/npm/@accessible360/accessible-slick@1.0.1/slick/slick.min.css"
      "//cdn.jsdelivr.net/npm/@accessible360/accessible-slick@1.0.1/slick/accessible-slick-theme.min.css"
      "//cdn.jsdelivr.net/npm/@accessible360/accessible-slick@1.0.1/slick/slick-theme.min.css"
    ],
    "script": "//cdn.jsdelivr.net/npm/@accessible360/accessible-slick@1.0.1/slick/slick.min.js",
  }
});
```

Even more advanced configurations for each scripts and styles. Notice style/script can be an object or an array of objects.

```javascript
depends.register({
  ...
  "accessible-slick@1.0": {
    "style": [
      {
        "href": "//cdn.jsdelivr.net/npm/@accessible360/accessible-slick@1.0.1/slick/slick-theme.min.css",
        "crossOrigin": "anonymous",
      },
      ...
    ],
    "script": {
      "src": "//cdn.jsdelivr.net/npm/@accessible360/accessible-slick@1.0.1/slick/slick.min.js",
      "crossOrigin": "anonymous",
    },
  }
});
```

Dependencies with dependencies. When loading, those dependencies will be loaded first, then the dependency.

```javascript
depends.register({
  ...
  "isotope@2.0": {
    "script": "https://cdnjs.cloudflare.com/ajax/libs/jquery.isotope/2.0.1/isotope.pkgd.min.js",
    "dependencies": ["jquery@3.0"],
  }
});
```

Calling register multiple times will do a top level merge:

```javascript
depends.register({
  "jquery": "https://code.jquery.com/jquery-3.7.1.min.js",
  "vue": { // object
    "https://unpkg.com/vue@2/dist/vue.global.js",
    "crossOrigin": "anonymous",
  },
});

depends.register({
  "vue": "https://unpkg.com/vue@3/dist/vue.global.js", // string will overwrite object
});
```

## Load script

Load script with no dependencies

```javascript
depends.load("featured-new", "js/featured-news.bundle.js");
```

Or as an object:

```javascript
depends.load("featured-new", {
  "src": "js/featured-news.bundle.js",
  "data-random": "peanut butter curry",
});
```

We can let load handle loading dependencies automatically. 

The following will first append dependencies (only if another script hasn't appended it already) then append featured-new script:

```javascript
depends.load("featured-new", "js/featured-news.bundle.js", ["jquery@3.0"]);
```

## Queue callback

Callback will only run after dependencies loaded

```javascript
depends.load("featured-new", () => {
  // code here
}, ["jquery@3.0"]);
```

## loadOnce

Append a `<script>` or queue callback once only

```javascript
depends.loadOnce("global", { // appended
  "src": "js/global.js",
}, ["jquery@3.4.1"]);

depends.loadOnce("global", { // ignored, global already appended
  "src": "js/global.js",
}, ["jquery@3.4.1"]);
```

## Load dependency

Dependencies can be manually loaded instead rather than loading as a dependency of a script/callback. This is only required when a dependency must be loaded regardless if a script needs it. Otherwise, just allow dependencies to be loaded on a need by need basis.

```javascript
depends.loadDependency("jquery@3.0");
```

Or, as an array:

```javascript
depends.loadDependency(["jquery@3.0"]);
```












## Local development

Install dependencies

```
$ npm i
```

Compile file once

```
$ npm run build
```

Or to watch files:

```
$ npm run start
```

### Testing

Tests are run in QUnit. Use a VS Code plugin like Live Server

http://localhost:5501/tests/