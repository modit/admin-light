angular.module('modit.admin', [
  'modit.admin.welcome',
  'modit.admin.home',
  'modit.api.v1',
  'modit.thumb',
  'ui.router',
  'templateImport',
  'ui.bootstrap'
])
  
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $stateProvider.state('app', {
    url: '/',
    controller: 'AppCtrl',
    templateUrl: 'app.tpl.html'
  });
  $urlRouterProvider.otherwise( '/' );
  
  var test = '';
  
})

.run(function($rootScope, $state, $location, api, ngToast) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    ngToast.dismiss();
  });
  
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if($state.is('app')){
      $state.go('app.home');
    }
  });
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    if(error.data === 'Not Authenticated'){
      if(!$state.includes('app.welcome')){
        $state.go('app.welcome', { redirect: $location.url().substr(1) ? $location.absUrl() : undefined });
      }else {
        $state.go('app.welcome');
      }
    } else if(error.status === 404) {
      $state.go('404');
    } else {
      console.log('stateChangeError', toState, fromState, error);
      $state.go('app.error', { status: error.status, error: error.data });
    }
    event.preventDefault();
  });
})

.controller('AppCtrl', function($scope, CORE_HOST) {
  $scope.logo = 'https://' + CORE_HOST + '/assets/logo.svg';
})
;