QUnit.module('depends', function(hooks) {
  
  const scriptTag = document.querySelector('script[src="index.js"]'); 

  const getStyles = () => {
    const linkTag = document.head.querySelector('link[href*="qunit"][href$=".css"]'); 
    let nextElement = linkTag.nextElementSibling;
    const styles = [];
    while (nextElement) {
      if (nextElement.tagName === 'LINK') {
        styles.push(nextElement); // Add to the array if it's a <script> tag
      }
      nextElement = nextElement.nextElementSibling; // Move to the next sibling
    }
    return styles;
  }

  const getScripts = () => {
    let nextElement = scriptTag.nextElementSibling;
    const scripts = [];
    while (nextElement) {
      if (nextElement.tagName === 'SCRIPT') {
        scripts.push(nextElement); // Add to the array if it's a <script> tag
      }
      nextElement = nextElement.nextElementSibling; // Move to the next sibling
    }
    return scripts;
  }

  // on each test, remove <script> tags added before it
  hooks.beforeEach((assert) => {
    for (const linkTag of getStyles()) {
      document.head.removeChild(linkTag);
    }
    for (const scriptTag of getScripts()) {
      document.body.removeChild(scriptTag);
    }
    depends.reset();

    window.done = null;
  });
  
  QUnit.test('test loadDependency with string', function(assert) {
    
    // test
    depends.register({
      "dep1": "js/dep1.js",
    });
    depends.loadDependency("dep1");

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 1);    
    assert.true(scripts[0].src.endsWith("js/dep1.js"));

  });
  
  QUnit.test('test loadDependency with multiple register calls', function(assert) {
    
    // test
    depends.register({
      "dep1": "js/dep1.js",
      "dep2": "js/dep2.js",
    });
    depends.register({
      "dep1": {
        "script": {
          "src": "js/dep1_copy.js",
        },
      }
    });
    depends.loadDependency(["dep1", "dep2"]);

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 2);    
    assert.true(scripts[0].src.endsWith("js/dep1_copy.js"));
    assert.true(scripts[1].src.endsWith("js/dep2.js"));

  });
  
  QUnit.test('test loadDependency', function(assert) {
    
    // test
    depends.register({
      "dep1": "js/dep1.js",
      "dep2": "js/dep2.js",
    });
    depends.loadDependency(["dep1", "dep2"]);

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 2)
    assert.true(scripts[0].src.endsWith("js/dep1.js"));
    assert.true(scripts[1].src.endsWith("js/dep2.js"));

  });
  
  QUnit.test('test loadDependency registered as object with script', function(assert) {
    
    // test
    depends.register({
      "dep1": {
        "script": "js/dep1.js",
      },
    });
    depends.loadDependency("dep1");

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 1)
    assert.true(scripts[0].src.endsWith("js/dep1.js"));

  });
  
  QUnit.test('test loadDependency registered as object with script as object', function(assert) {
    
    // test
    depends.register({
      "dep1": {
        "script": {
          "src": "js/dep1.js",
        },
      },
    });
    depends.loadDependency("dep1");

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 1)
    assert.true(scripts[0].src.endsWith("js/dep1.js"));

  });
  
  QUnit.test('test loadDependency registered as object with script as array of object', function(assert) {
    
    // test
    depends.register({
      "dep1": {
        "script": [{
          "src": "js/dep1.js",
        }],
      },
    });
    depends.loadDependency("dep1");

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 1)
    assert.true(scripts[0].src.endsWith("js/dep1.js"));

  });
  
  QUnit.test('test loadDependency registered as object with multiple scripts', function(assert) {
    
    // test
    depends.register({
      "dep1": {
        "script": ["js/dep1.js", "js/dep1_1.js"],
      },
    });
    depends.loadDependency("dep1");

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 2)
    assert.true(scripts[0].src.endsWith("js/dep1.js"));
    assert.true(scripts[1].src.endsWith("js/dep1_1.js"));

  });
  
  QUnit.test('test loadDependency registered as object with style', function(assert) {
    
    // test
    depends.register({
      "dep1": {
        "style": "js/dep1.css",
      },
    });
    depends.loadDependency("dep1");

    // assert
    const styles = getStyles();    
    assert.equal(styles.length, 1)
    assert.true(styles[0].href.endsWith("js/dep1.css"));

  });
  
  QUnit.test('test loadDependency registered as object with style as object', function(assert) {
    
    // test
    depends.register({
      "dep1": {
        "style": {
          "href": "js/dep1.css"
        },
      },
    });
    depends.loadDependency("dep1");

    // assert
    const styles = getStyles();
    
    assert.equal(styles.length, 1)
    assert.true(styles[0].href.endsWith("js/dep1.css"));

  });
  
  QUnit.test('test loadDependency registered as object with style as array of object', function(assert) {
    
    // test
    depends.register({
      "dep1": {
        "style": [{
          "href": "js/dep1.css"
        }],
      },
    });
    depends.loadDependency("dep1");

    // assert
    const styles = getStyles();
    
    assert.equal(styles.length, 1)
    assert.true(styles[0].href.endsWith("js/dep1.css"));

  });
  
  QUnit.test('test loadDependency registered as object with multiple styles', function(assert) {
    
    // test
    depends.register({
      "dep1": {
        "style": ["js/dep1.css", "js/dep1_1.css"],
      },
    });
    depends.loadDependency("dep1");

    // assert
    const styles = getStyles();
    assert.equal(styles.length, 2)
    assert.true(styles[0].href.endsWith("js/dep1.css"));
    assert.true(styles[1].href.endsWith("js/dep1_1.css"));

  });
  
  QUnit.test('test loadDependency does not load dependency twice', function(assert) {
    
    // test
    depends.register({
      "dep1": "js/dep1.js",
    });
    depends.loadDependency("dep1");
    depends.loadDependency("dep1");

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 1)
    assert.true(scripts[0].src.endsWith("js/dep1.js"));

  });
  
  QUnit.test('test dependencies load their own dependencies in order first', function(assert) {
    
    // test
    depends.register({
      "dep1": "js/dep1.js",
      "dep2": {
        "script": "js/dep2.js",
        "dependencies": ["dep1"]
      },
      "dep3": "js/dep3.js",
      "dep4": {
        "script": "js/dep4.js",
        "dependencies": ["dep3", "dep2"] // notice the order
      },
    });
    depends.loadDependency("dep4");

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 2);
    assert.true(scripts[0].src.endsWith("js/dep3.js"));
    assert.true(scripts[1].src.endsWith("js/dep1.js"));
    // assert.true(scripts[2].src.endsWith("js/dep2.js"));
    // assert.true(scripts[3].src.endsWith("js/dep4.js"));

  });
  
  QUnit.test('test load appends script with script-src string', function(assert) {
    
    // test 
    depends.load("test", "js/test.js");
    
    // assert 
    const scripts = getScripts();
    assert.equal(scripts.length, 1);
    // assert.true(scripts[0].src.endsWith("js/test.js"));

  });
  
  QUnit.test('test load appends script with src as object', function(assert) {
    depends.load("test", { src: "js/test.js", "data-test": "test" });
    assert.true(!!document.querySelector(`script[src="js/test.js"][data-test="test"]`));
  });
  
  QUnit.test('test load appends script multiple times', function(assert) {
    depends.load("test", "js/test.js");
    depends.load("test", "js/test.js");
    depends.load("test", "js/test.js");
    assert.equal(document.querySelectorAll(`script[src="js/test.js"]`).length, 3);
  });
  
  QUnit.test('test load with dependencies', function(assert) {

    // // Set the timeout to fail the test if done is not called within the given time
    // assert.timeout(1000);  // Optional: extend the default timeout to 5 seconds

    // // due to dependencies, we need to wait on the script
    // window.done = assert.async();
    
    // test
    depends.register({
      "dep1": "js/dep1.js",
      "dep2": "js/dep2.js"
    });
    depends.load("test", "js/test.js", ["dep2", "dep1"]);

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 2);
    assert.true(scripts[0].src.endsWith("js/dep2.js"));
    assert.true(scripts[1].src.endsWith("js/dep1.js"));
    // assert.true(scripts[2].src.endsWith("js/test.js"));

  });
  
  QUnit.test('test loadOnce appends script once only', function(assert) {
    depends.loadOnce("test", "js/test.js");
    depends.loadOnce("test", "js/test.js");
    depends.loadOnce("test", "js/test.js");
    assert.equal(document.querySelectorAll(`script[src="js/test.js"]`).length, 1);
  });
  
  QUnit.test('test load with callback', function(assert) {

    const done = assert.async();
    
    // test
    depends.register({
      "dep1": "js/dep1.js",
      "dep2": "js/dep2.js"
    });
    depends.load("test callback", () => {
      done();
    }, ["dep2", "dep1"]);

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 2);
    assert.true(scripts[0].src.endsWith("js/dep2.js"));
    assert.true(scripts[1].src.endsWith("js/dep1.js"));

  });
  
  QUnit.test('test loadOnce with callback', function(assert) {

    const done = assert.async(2);
    
    // test
    depends.register({
      "dep1": "js/dep1.js",
      "dep2": "js/dep2.js"
    });
    depends.loadOnce("test callback", () => {
      assert.ok(true, "First callback was executed.");
      done(); // Mark this async as done
    }, ["dep2", "dep1"]);

    // Second loadOnce callback should not run
    let secondCallbackRan = false;

    depends.loadOnce("test callback", () => {
      secondCallbackRan = true; // Mark that this callback ran
      assert.ok(false, "Second callback should not have been executed.");
      done(); // We still need to call done, but this should never happen
    }, ["dep2", "dep1"]);
  
    // Check that the second callback did not run
    setTimeout(() => {
      assert.notOk(secondCallbackRan, "Second callback was not executed.");
      done(); // Mark this as done for the second part of the test
    }, 100); // Adjust timeout duration based on your test scenario

    // assert
    const scripts = getScripts();
    assert.equal(scripts.length, 2);
    assert.true(scripts[0].src.endsWith("js/dep2.js"));
    assert.true(scripts[1].src.endsWith("js/dep1.js"));

  });

});