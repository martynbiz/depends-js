import { appendStyle, appendScript } from "./functions";

class Depends {
  constructor() {

    // registered 
    this.dependencies = {};

    // loadedStatus to dom 
    this.loadedStatus = {};

    // loadedStatus to dom 
    this.pendingCallbacks = [];
  }

  /**
   * Useful for testing
   */
  reset() {
    this.dependencies = {};
    this.loadedStatus = {};
  }

  /**
   * Configure dependencies 
   * @param {object} deps 
   */
  register(dependencies) {

    // Store the provided dependencies in the instance
    this.dependencies = { ...this.dependencies, ...dependencies };    

  }

  /**
   * Will check if a given array of dependencies is loaded
   * @param {array} dependencies 
   */
  #hasDependencies(dependencies) {
    for (const dependency of dependencies) {
      if (!(dependency in this.loadedStatus) || this.loadedStatus[dependency] !== true) {
        return false;
      }
    }
    return true;
  }

  /**
   * this function will set dep loading status when all have been loaded
   * @param {array} loadingStyles 
   * @param {array} loadingScripts 
   */
  #checkLoaded(dependency, loadingStyles, loadingScripts) {    
    
    // set loaded status true if all assets have loaded
    this.loadedStatus[dependency] = (loadingStyles.length + loadingScripts.length === 0);
    
    // check pending callbacks
    for (let i = 0; i < this.pendingCallbacks.length; i++) {
      const pendingCallback = this.pendingCallbacks.shift();
      const [name, cb, dependencies] = pendingCallback;
      if (this.#hasDependencies(dependencies)) {
        cb();
        this.loadedStatus[name] = true;
      } else {
        this.pendingCallbacks.push(pendingCallback);
      }
    }
  }

  /**
   * Load dependencies will load styles and scripts for each 
   * @param {array} dependencies 
   * @param {function} callback Run when dependencies loaded 
   */
  loadDependency(dependency, cb = () => {}) {

    // check dependency is not already loadedStatus
    if (dependency in this.loadedStatus) {
      return;
    }

    // get dependency data 
    const dependencySrc = this.dependencies[dependency];
    
    const loadingScripts = [];
    const loadingStyles = [];

    // check if dependencySrc is string, or object
    if (typeof dependencySrc === 'string') {
      loadingScripts.push(dependencySrc);
    } else if (typeof dependencySrc === 'object' && dependencySrc !== null && !Array.isArray(dependencySrc)) {
      
      // check loadingStyles, might be undefined
      if ("style" in dependencySrc) {
        if (Array.isArray(dependencySrc.style)) {
          loadingStyles.push(...dependencySrc.style);
        } else {
          loadingStyles.push(dependencySrc.style);
        }
      }

      // check loadingScripts, might be undefined
      if ("script" in dependencySrc) {
        if (Array.isArray(dependencySrc.script)) {
          loadingScripts.push(...dependencySrc.script);
        } else {
          loadingScripts.push(dependencySrc.script);
        }
      }

      // load this dependency's dependencies
      if ("dependencies" in dependencySrc) {
        for (const name of dependencySrc.dependencies) {
          this.loadDependency(name);
        }
      }
      
    } else {
      console.log("Invalid type for registered dependency. Expected a string or an object. ", dependencySrc);
    }

    // append this style now dependencies have been loaded
    for (const style of loadingStyles) {
      const linkTag = appendStyle(style);
      linkTag.addEventListener('load', () => {
        loadingStyles.splice(loadingStyles.indexOf(style), 1);
        this.#checkLoaded(dependency, loadingStyles, loadingScripts);
      });
    }

    // append this script now dependencies have been loaded
    for (const script of loadingScripts) {
      const scriptTag = appendScript(script);
      scriptTag.addEventListener('load', () => {
        loadingScripts.splice(loadingScripts.indexOf(script), 1);
        this.#checkLoaded(dependency, loadingStyles, loadingScripts);
      });
    }

    // set loaded to false
    this.loadedStatus[dependency] = false;
      
  }

  /**
   * Load dependencies will load styles and scripts for each 
   * @param {array} dependencies 
   */
  loadDependencies(dependencies) {
    for (const dependency of dependencies) {
      this.loadDependency(dependency);
    }
  }

  /**
   * Load a <script> tag every time called
   * @param {string} id 
   * @param {object} attributes 
   * @param {array} dependencies 
   */
  load(name, src, dependencies = [], loadOnce = false) {

    if (loadOnce && name in this.loadedStatus) {
      return;
    }

    // append this script now dependencies have been loaded
    if (typeof src === "function") {      
      this.loadDependencies(dependencies);
      this.pendingCallbacks.push([name, src, dependencies]);    
    } else {
      this.loadDependencies(dependencies);
      appendScript(src);
    }

    // set to is loading
    this.loadedStatus[name] = false;

  }

  /**
   * Load a <script> tag every time called
   * @param {string} id 
   * @param {object} attributes 
   * @param {array} dependencies 
   */
  loadOnce(name, attributes, dependencies) {
    return this.load(name, attributes, dependencies, true);
  }
}

// Create an instance of the Depends class
window.depends = new Depends();
