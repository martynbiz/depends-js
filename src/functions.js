/**
 * 
 * @param {str|object} src 
 */
export const appendStyle = (href) => {

  // handle href as a string or an object
  const attr = {};
  if (typeof href === 'string') {
    attr.href = href
  } else if (typeof href === 'object' && !Array.isArray(href)) {
    Object.assign(attr, href);
  } else {
    console.log(`Unexpected type for href:`, href);
  }
  
  var link = document.createElement('link');

  // set defaults
  link.rel = "stylesheet";

  // create <link> element
  for (let key in attr) {
    if (attr.hasOwnProperty(key)) {
      link.setAttribute(key, attr[key]);
    }
  }

  // append to body
  document.head.appendChild(link);

  return link;

}

/**
 * 
 * @param {str|object} src 
 */
export const appendScript = (src) => {  

  // handle src as a string or an object
  const attr = {};
  if (typeof src === 'string') {
    attr.src = src
  } else if (typeof src === 'object' && !Array.isArray(src)) {
    Object.assign(attr, src);
  } else {
    console.log(`Unexpected type for src:`, src);
  }
  
  var script = document.createElement('script');

  // set defaults
  script.defer = true;
  // script.async = true;

  // create <script> element
  for (let key in attr) {
    if (attr.hasOwnProperty(key)) {
      script.setAttribute(key, attr[key]);
    }
  }

  // append to body
  document.body.appendChild(script);

  return script;

}