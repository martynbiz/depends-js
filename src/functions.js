/**
 * 
 * @param {str|object} src 
 */
export const appendStyle = (name, href) => {

  // handle href as a string or an object
  const attr = {};
  if (typeof href === 'string') {
    attr.href = href
  } else if (typeof href === 'object' && !Array.isArray(href)) {
    Object.assign(attr, href);
  } else {
    console.log(`Unexpected type for href:`, href);
  }

  // create <link> element
  var link = document.createElement('link');
  for (let key in attr) {
    if (attr.hasOwnProperty(key)) {
      link.setAttribute(key, attr[key]);
    }
  }

  // append to body
  document.head.appendChild(link);

}

/**
 * 
 * @param {str|object} src 
 */
export const appendScript = (name, src) => {

  // handle src as a string or an object
  const attr = {};
  if (typeof src === 'string') {
    attr.src = src
  } else if (typeof src === 'object' && !Array.isArray(src)) {
    Object.assign(attr, src);
  } else {
    console.log(`Unexpected type for src:`, src);
  }

  // create <script> element
  var script = document.createElement('script');
  for (let key in attr) {
    if (attr.hasOwnProperty(key)) {
      script.setAttribute(key, attr[key]);
    }
  }

  // append to body
  document.body.appendChild(script);

}