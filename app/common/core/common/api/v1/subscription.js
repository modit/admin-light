angular.module('modit.api.v1.subscription', ['ngResource'])
  .factory('Subscription', ['$resource', 'ApiConfig', function($resource, ApiConfig) {
    
    var resource = $resource(ApiConfig.base + '/subscriptions/:subscription', { subscription:    '@_id' });
    
    return resource;
  }])
;