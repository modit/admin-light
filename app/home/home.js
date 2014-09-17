angular.module('modit.admin.home', [
  'ui.router',
  'modit.api.v1'
])
  
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $stateProvider.state('app.home', {
    url: '',
    resolve: {
      currentUser: ['CurrentUser', function(CurrentUser){
        return CurrentUser.get().$promise;
      }]
    },
    views: {
      main: {
        controller: 'HomeCtrl',
        templateUrl: 'home.tpl.html'
      },
      usernav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user-nav.tpl.html'
      }
    },
  });
})

.controller('HomeCtrl', function($scope, currentUser) {
  
})

.controller('UserNavCtrl', function($scope, currentUser, API_HOST) {
  $scope.user = currentUser;
  $scope.API_HOST = API_HOST;
  $scope.origin = window.location.origin;
})
;
  