angular.module('modit.api.v1.user', ['ngResource'])
  .factory('CurrentUser', ['$resource', '$http', 'ApiConfig',
    function($resource, $http, ApiConfig) {
      
      return $resource(ApiConfig.base + '/user').$subresource({
        Project:    $resource(ApiConfig.base + '/user/projects'),
        Org:        $resource(ApiConfig.base + '/user/organizations'),
        Plan:       $resource(ApiConfig.base + '/user/account/available-plans'),
        Account:    $resource(ApiConfig.base + '/user/account', null, { update: { method: 'PATCH' } } ),
        Profile:    $resource(ApiConfig.base + '/user/profile', null, { update: { method: 'PATCH' } } ),
        GitHubRepo: $resource(ApiConfig.base + '/user/github-repos')
      });
      
    }
  ])
  .factory('User', ['$resource', 'ApiConfig', function($resource, ApiConfig) {
    return $resource(ApiConfig.base + '/users/:user', { user: '@profile.username' }, {
      search: { method: 'GET', isArray: true, url: ApiConfig.base + '/search/users' }
    }).$subresource({
      Project:  $resource(ApiConfig.base + '/users/:user/projects'),
      Org:      $resource(ApiConfig.base + '/users/:user/organizations'),
    });
    
  }])
;