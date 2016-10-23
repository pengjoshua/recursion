// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  // your code goes here
  var idx = 0;  // index
  var ch = ' '; // current character
  var special = {
    '"':  '"',  // quotation mark
    '\\': '\\', // backslash
    '/':  '/',  // slash
    b:    '\b', // backspace
    f:    '\f', // form feed
    n:    '\n', // new line
    r:    '\r', // carriage return
    t:    '\t'  // horizontal tab
  };

  // next character
  var next = function(nc) {
    if (nc && nc !== ch) { // throw error with unexpected character
      throw new SyntaxError();
    }
    ch = json.charAt(idx);
    idx += 1;
    return ch;
  };

  // whitespace
  var whitespace = function() { 
    while (ch && ch <= ' ') { // process space or empty space
      next();
    }
  };

  // booleans and null
  var booleans = function() {
    if (ch === 't') { // true
      next('t');
      next('r');
      next('u');
      next('e');
      return true;
    }
    else if (ch === 'f') { // false
      next('f');
      next('a');
      next('l');
      next('s');
      next('e');
      return false;
    }
    else if (ch === 'n') { // null
      next('n');
      next('u');
      next('l');
      next('l');
      return null;
    }
    else {
      throw new SyntaxError("bad boolean or null");
    }
  };

  // objects
  var objects = function() {
    // object = { key0 : value0, key1 : value1, ... }
    var key;
    var obj = {};

    if (ch === '{') { // objects start with '{'
      next('{');
      whitespace();
      if (ch === '}') { // objects end with '}', check empty object '{}'
        next('}');
        return obj;
      }
      while (ch) { // keys are strings
        key = strings(); // so run strings function to process strings
        whitespace();
        next(':');
        if (Object.hasOwnProperty.call(obj, key)) { // check for duplicate key
          throw new SyntaxError('"' + key + '" is a duplicate key');
        }
        obj[key] = datatype(); // add key to object, run datatype
        whitespace();
        if (ch === '}') { // objects end with '}'
          next('}'); 
          return obj;
        }
        next(','); // check if more keys/values
        whitespace();
      }
    }
    throw new SyntaxError("bad object");
  };

  // arrays
  var arrays = function() {
    // array = [ value0, value1, ... value ]
    var arr = [];

    if (ch === '[') { // arrays start with '['
      next('[');
      whitespace();
      if (ch === ']') { // arrays end with ']', check empty array '[]'
        next(']'); 
        return arr;
      }
      while (ch) {
        arr.push(datatype()); // add element to array, run datatype
        whitespace();
        if (ch === ']') { // arrays end with ']'
          next(']');
          return arr;
        }
        next(','); // check for more elements joined by comma
        whitespace();
      }
    }
    throw new SyntaxError("bad array");
  };

  // numbers
  var numbers = function() {
    // possible numbers: negative -n, decimal 0.n, exponent E or e
    var num;
    var str = '';
    if (ch === '-') { // check for negative sign "-"
      str = '-';
      next('-');
    }
    while (ch >= '0' && ch <= '9') { // check for number and add to string
      str += ch;
      next();
    }
    // decimal
    if (ch === '.') { // check for decimal point and add to string
      str += '.';
      while (next() && ch >= '0' && ch <= '9') { // add number following decimal point to string
        str += ch;
      }
    }
    // exponent
    if (ch === 'E' || ch === 'e') { // check for exponent E or e and add to string
      str += ch;
      next();
      if (ch === '+' || ch === '-') { // check for positive'+'/negative'-' exponent and add to string
        str += ch;
        next();
      }
      while (ch >= '0' && ch <= '9') { // check for exponent number and add to string
        str += ch;
        next();
      }
    }
    num = Number(str); // convert stringified number to number
    if (!isFinite(num)) {
      throw new SyntaxError("bad number");
    }
    return num;
  };

  // strings
  var strings = function() {
    // strings = "string"
    var hex;
    var digits;
    var str = '';

    if (ch === '"') { // strings start with "
      while (next()) {
        if (ch === '"') { // check empty string ""
          next();
          return str;
        }
        if (ch === '\\') { // check special characters "\"
          next();
          if (ch === 'u') { // check 4 hexadecimal digits starting with "\u"
            digits = 0;
            for (var i = 0; i < 4; i++) { // loop to compute hexadecimal value
              hex = parseInt(next(), 16); 
              if (!isFinite(hex)) {
                break;
              }
              digits = digits * 16 + hex;
            }
            str += String.fromCharCode(digits); // convert hexadecimal value to string
          } 
          else if (typeof special[ch] === "string") { // check special characters "\"
            str += special[ch];
          } 
          else { // break out of while loop
            break;
          }
        } 
        else { // add next character to string
          str += ch;
        }
      }
    }
    throw new SyntaxError("bad string");
  };

  // select function based on current character
  var datatype = function() {
    whitespace();           // check for whitespace first
    if (ch === 't' || ch === 'f' || ch === 'n' || ch === 'u') { // booleans and null
      return booleans(); 
    }
    else if (ch === '{') {  // objects 
      return objects();  
    }
    else if (ch === '[') {  // arrays 
      return arrays(); 
    }
    else if (ch === '-' || (ch >= 0 && ch <= 9)) { // numbers 
      return numbers(); 
    }
    else if (ch === '"') {  // strings
      return strings(); 
    }
    else {
      throw new SyntaxError("unexpected character");
    }
  };

  // run datatype function and return result
  return datatype();
};
