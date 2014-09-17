angular.module('modit.api.v1.socket', [])
  .provider('Socket', function() {

    return {
      $get: ['$rootScope', function($rootScope){
        
        var _socket, _server;
        
        return {
          connect: function(server){
            _server = server;
            _socket = io.connect(_server);
    
            _socket.on('connect', function(event){
              $rootScope.$broadcast('io:connect', event);
            });
            
            _socket.on('failed', function(event){
              _socket.io.disconnect();
              _socket.io.connect(_server);
            });
          },
          subscribe: function(target, scope){
            var api = this;
            
            _socket.emit('api:subscribe', { target: target });
            _socket.removeAllListeners('activity:' + target);
            
            _socket.on('activity:' + target, function(data) {
              $rootScope.$broadcast('activity:' + target, data);
              $rootScope.$apply();
            });
            
            if(scope){
              scope.$on('$destroy', function() {
                api.unsubscribe(target);
              });
            }
          },
          unsubscribe: function(target){
            _socket.emit('api:unsubscribe', { target : target });
            _socket.removeAllListeners('activity:' + target);
          },
          refresh: function(){
            _socket.io.disconnect();
            _socket.io.connect(_server);
          }
        };
      }]
    };
  })
;