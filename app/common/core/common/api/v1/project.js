angular.module('modit.api.v1.project', ['ngResource'])
  .factory('Project', ['$resource', 'ApiConfig', 'Proto', 'Review', function($resource, ApiConfig, Proto, Review) {
    
    var resource = $resource(ApiConfig.base + '/projects/:owner/:project', {
      owner:    '@owner.profile.username',
      project:  '@indexedName'
    }, {
      search: { method: 'GET', isArray: true, url: ApiConfig.base + '/search/projects' }
    });
    
    resource.$subresource({
      Metadata:     $resource(ApiConfig.base + '/projects/:owner/:project/metadata',  null, { update: { method: 'PATCH' } }),
      Variable:     $resource(ApiConfig.base + '/projects/:owner/:project/variables', null, { save:   { method: 'POST', isArray: true }}),
      Collaborator: $resource(ApiConfig.base + '/projects/:owner/:project/collaborators/:collaborator', { collaborator: '@profile.username' }),
      Team:         $resource(ApiConfig.base + '/projects/:owner/:project/teams/:team', { team: '@indexedName' }),
      Repo:         $resource(ApiConfig.base + '/projects/:owner/:project/repo'),
      Feed:         $resource(ApiConfig.base + '/projects/:owner/:project/feed'),
      Proto:        Proto,
      Review:       Review
    });
    
    return resource;
  }])
  .factory('Proto', ['$resource', '$sce', 'ansi2html', 'ApiConfig',
    function($resource, $sce, ansi2html, ApiConfig) {
      
      var resource = $resource(ApiConfig.base + '/projects/:owner/:project/protos/:proto', { proto: '@number' } );
      
      resource.$subresource({
        Rebuild:  $resource(ApiConfig.base + '/projects/:owner/:project/protos/:proto/rebuild'),
        Start:    $resource(ApiConfig.base + '/projects/:owner/:project/protos/:proto/start'),
        Stop:     $resource(ApiConfig.base + '/projects/:owner/:project/protos/:proto/stop'),
        Log:      $resource(ApiConfig.base + '/projects/:owner/:project/protos/:proto/logs/:service/:type', null, {
          get: {
            method: 'GET',
            transformResponse: function(data){
              return { content: $sce.trustAsHtml(ansi2html.toHtml(data)) };
            }
          }
        })
      });
      
      return resource;
    }
  ])
  .factory('Review', ['$resource', 'ApiConfig',
    function($resource, ApiConfig) {
      
      var resource = $resource(ApiConfig.base + '/projects/:owner/:project/reviews/:review', { review: '@number' } );
      
      resource.$subresource({
        Metadata: $resource(ApiConfig.base + '/projects/:owner/:project/reviews/:review/metadata', null, { update: { method: 'PATCH' } }),
        Comment:  $resource(ApiConfig.base + '/projects/:owner/:project/reviews/:review/comments/:comment', { comment: '@_id' }, {
          update: { method: 'POST', url: ApiConfig.base + '/comments/:comment'}
        })
      });
      
      return resource;
    }
  ])
;