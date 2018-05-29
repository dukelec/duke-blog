"use strict";

showdown.extension('codehighlight', function() {
  function htmlunencode(text) {
    return (
      text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
    );
  }
  return [
    {
      type: 'output',
      filter: function (text, converter, options) {
        // use new shodown's regexp engine to conditionally parse codeblocks
        var left  = '<pre><code\\b[^>]*>',
            right = '</code></pre>',
            flags = 'g',
            replacement = function (wholeMatch, match, left, right) {
              // unescape match to prevent double escaping
              match = htmlunencode(match);
              return left + hljs.highlightAuto(match).value + right;
            };
        return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
      }
    }
  ];
});
showdown.extension('bootstrap-tables', function () {
  return [{
    type: "output",
    filter: function (text, converter, options) {
  
      var left  = '<table\\b[^>]*>',
          right = '</table>',
          flags = 'g',
          replacement = function (wholeMatch, match, left, right) {
            return '<div class="class table-responsive"><table class="table table-striped table-bordered">'
                   + match + '</table></div>';
          };
      return showdown.helper.replaceRecursiveRegExp(text, replacement, left, right, flags);
    }
  }];
});
showdown.setFlavor('github');
showdown.setOption('tables', true);
showdown.setOption('parseImgDimensions', true);
showdown.setOption('simpleLineBreaks', false);

