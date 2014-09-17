angular.module('modit.admin.welcome', [
  'ui.router',
  'modit.api.v1'
])
  
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $stateProvider.state('app.welcome', {
    url: 'welcome',
    views: {
      main: {
        controller: 'WelcomeCtrl',
        templateUrl: 'welcome.tpl.html'
      }
    }

  });
  $urlRouterProvider.otherwise( '/' );
})

.controller('WelcomeCtrl', function($scope, API_HOST) {
  $scope.API_HOST = API_HOST;
  $scope.origin = window.location.origin;
})
;
  