// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
  // null
  if (obj === null) {
    return "null";
  }

  // undefined and functions
  if (obj === undefined || obj.constructor === Function) { 
    return "undefined"; 
  }

  // numbers and booleans
  if (obj.constructor === Number || obj.constructor === Boolean) {
    return obj.toString();
  }

  // strings
  if (obj.constructor === String) {
    return '"' + obj + '"';
  }

  // arrays
  if (obj.constructor === Array) {
    if (obj.length) { // not an empty array
      var stringified = [];
      for (var i = 0; i < obj.length; i++) {
        stringified.push(stringifyJSON(obj[i]));
      }
      return "[" + stringified.join(",") + "]";
    } 
    else { // empty array
      return "[]";
    }
  }

  // objects
  if (obj.constructor === Object) {
    var keys = Object.keys(obj);
    if (keys.length) { // not an empty object
      var stringified = "";
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key && obj[key] !== undefined && typeof key !== 'function' && typeof obj[key] !== 'function') {
          if (i < keys.length - 1) {
            stringified += stringifyJSON(key) + ":" + stringifyJSON(obj[key]) + ",";
          } 
          else {
            stringified += stringifyJSON(key) + ":" + stringifyJSON(obj[key]);
          }
        }
      }
      return "{" + stringified + "}";
    } 
    else { // empty object
      return "{}"; 
    }
  }
};
