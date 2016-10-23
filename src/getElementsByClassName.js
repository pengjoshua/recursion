// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  // your code here
  var matches = []; // initialize matching elements array
  function checkForMatches(node) {
  	if (node.classList) {
      if (node.classList.contains(className)) {
        matches.push(node); // add node to matches array node's classList contains className
      }
  	}
    for (var i = 0; i < node.childNodes.length; i++) {
      checkForMatches(node.childNodes[i]); // recursively check for matches for each child node
    }
  }
  checkForMatches(document.body); // recursively check document body
  return matches;
};
