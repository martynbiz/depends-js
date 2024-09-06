import { appendStyle, appendScript } from "./functions";

class Depends {
  constructor() {
    this.dependencies = {};
    this.loaded = [];
  }

  /**
   * Useful for testing
   */
  reset() {
    this.dependencies = {};
    this.loaded = [];
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
   * Load dependencies will load styles and scripts for each 
   * @param {array} dependencies 
   */
  loadDependency(dependency) {

    // check dependency is not already loaded
    if (this.loaded.includes(dependency)) {
      return;
    }

    // get dependency data 
    const dependencySrc = this.dependencies[dependency];
    
    const scripts = [];
    const styles = [];

    // check if dependencySrc is string, or object
    if (typeof dependencySrc === 'string') {
      scripts.push(dependencySrc);
    } else if (typeof dependencySrc === 'object' && dependencySrc !== null && !Array.isArray(dependencySrc)) {
      
      // check styles, might be undefined
      if ("style" in dependencySrc) {
        if (Array.isArray(dependencySrc.style)) {
          styles.push(...dependencySrc.style);
        } else {
          styles.push(dependencySrc.style);
        }
      }

      // check scripts, might be undefined
      if ("script" in dependencySrc) {
        if (Array.isArray(dependencySrc.script)) {
          scripts.push(...dependencySrc.script);
        } else {
          scripts.push(dependencySrc.script);
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
    for (const style of styles) {
      appendStyle(name, style);
    }

    // append this script now dependencies have been loaded
    for (const script of scripts) {
      appendScript(name, script);
    }

    this.loaded.push(dependency);
      
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
   * 
   * @param {string|array} dependency 
   */
  setLoaded(dependency) {

    const dependencies = [];
    if (typeof dependency === "string") {
      if (!this.loaded.includes(dependency)) {
        this.loaded.push(dependency);
      }
    } else if (Array.isArray(dependency)) {
      dependencies.push(...dependency)
    }
    
    for (const dependency of dependencies) {
      this.loaded.push(dependency);
    }

  }

  /**
   * Load a <script> tag every time called
   * @param {string} id 
   * @param {object} attributes 
   * @param {array} dependencies 
   */
  load(name, src, dependencies = [], loadOnce = false) {

    if (loadOnce && this.loaded.has(name)) {
      return;
    }

    // ensure all dependencies have been loaded
    this.loadDependencies(dependencies);

    // append this script now dependencies have been loaded
    appendScript(name, src);

  }

  // /**
  //  * Load a <script> tag every time called
  //  * @param {string} id 
  //  * @param {object} attributes 
  //  * @param {array} dependencies 
  //  */
  // loadOnce(id, attributes, dependencies) {

    

  //   return this.load(id, attributes, dependencies);
  // }
}

// Create an instance of the Depends class
window.depends = new Depends();
