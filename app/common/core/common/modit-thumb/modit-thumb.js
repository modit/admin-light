angular.module('modit.thumb', [])

.constant('G_PREFIX', 'https://secure.gravatar.com/avatar/')
.constant('G_SUFFIX', '.jpg?d=identicon&s=')
.constant('G_SIZE', 80)

.directive('moditThumb', function(G_PREFIX, G_SUFFIX, G_SIZE){
  return {
    restrict: 'A',
    scope: {
      user: '=moditThumb',
      size: '=thumbSize',
      left: '@',
      right: '@'
    },
    link: function(scope, element, attrs){
      
      if(attrs.left !== undefined){
        element[0].style.marginRight = '5px';
      }
      
      if(attrs.right !== undefined){
        element[0].style.marginLeft = '5px';
      }
      
      scope.$watch(function(){
        return scope.user.$resolved === undefined ? true : scope.user.$resolved;
      }, function(resolved){
        if(resolved){
          var size = scope.size || G_SIZE;
          element[0].src = G_PREFIX + scope.user.gravatar + G_SUFFIX + size;
        }
      });
    }
  };
})

;