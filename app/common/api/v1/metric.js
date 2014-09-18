angular.module('modit.api.v1.metric', ['modit.api.v1', 'ngResource'])
  .factory('Metric', ['$resource', '$http', 'ApiConfig',
    function($resource, $http, ApiConfig) {
      
      return $resource(ApiConfig.base + '/metric').$subresource({
        // Project:    $resource(ApiConfig.base + '/user/projects'),
        // Org:        $resource(ApiConfig.base + '/user/organizations'),
        // Plan:       $resource(ApiConfig.base + '/user/account/available-plans'),
        // Account:    $resource(ApiConfig.base + '/user/account', null, { update: { method: 'PATCH' } } ),
        // Profile:    $resource(ApiConfig.base + '/user/profile', null, { update: { method: 'PATCH' } } ),
        // GitHubRepo: $resource(ApiConfig.base + '/user/github-repos')
      });
      
    }
  ])
  
  
  //nightly aggregation
  //project total
  
  //Spec
  //projects - number created within range
  //filters include (metadata.private)
  
;