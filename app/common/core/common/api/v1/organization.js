angular.module('modit.api.v1.organization', ['ngResource'])
  .factory('Org', ['$resource', 'ApiConfig', 'Team',
    function($resource, ApiConfig, Team) {
      
      return $resource(ApiConfig.base + '/orgs/:org', { org: '@profile.username' }).$subresource({
        Project:  $resource(ApiConfig.base + '/orgs/:org/projects'),
        Org:      $resource(ApiConfig.base + '/orgs/:org/organizations'),
        Plan:     $resource(ApiConfig.base + '/orgs/:org/account/available-plans'),
        Account:  $resource(ApiConfig.base + '/orgs/:org/account', null, { update: { method: 'PATCH' } } ),
        Profile:  $resource(ApiConfig.base + '/orgs/:org/profile', null, { update: { method: 'PATCH' } } ),
        Team:     Team
      });
      
    }
  ])
  .factory('Team', ['$resource', 'ApiConfig',
    function($resource, ApiConfig) {
      
      var resource = $resource(ApiConfig.base + '/orgs/:org/teams/:team', { team: '@indexedName' }, {
        update: { method: 'PATCH' },
        search: { method: 'GET', isArray: true, url: ApiConfig.base + '/search/teams' }
      } );
      
      resource.$subresource({
        Metadata:   $resource(ApiConfig.base + '/orgs/:org/teams/:team/metadata', null, { update: { method: 'PATCH' } }),
        Member:     $resource(ApiConfig.base + '/orgs/:org/teams/:team/members/:member', { member: '@profile.username' })
      });
      
      return resource;
    }
  ])
;
