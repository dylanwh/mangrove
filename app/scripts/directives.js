angular.module('mgDirectives', []).
directive('mgFocus', function ($timeout) {
  return function (scope, elem, attrs) {
    scope.$watch(attrs.mgFocus, function (newval) {
      if (newval) {
        elem[0].focus();
      }
    });
  };
}).
directive('mgFocusSelect', function () {
    return function (scope, elem, attrs) {
        scope.$watch(attrs.mgFocusSelect, function (newval) {
        if (newval) {
            elem[0].focus();
            elem[0].select();
        }
        });
    };
}).
directive('mgEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.mgEnter, {
            'event': event
          });
        });

        event.preventDefault();
      }
    });
  };
});
