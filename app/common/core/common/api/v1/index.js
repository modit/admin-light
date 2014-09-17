angular.module('modit.api.v1', [
    'modit.api.v1.user',
    'modit.api.v1.project',
    'modit.api.v1.organization',
    'modit.api.v1.socket',
    'modit.api.v1.subscription',
    'ngResource',
    'ngToast'
  ])
  .provider('ApiConfig', function(){
    var config = {
      base: '/api/v1'
    };
    
    return {
      set: function(values){
        angular.extend(config, values);
      },
      $get: function(){
        return config;
      }
    };
  })
  .factory('api', ['$q', '$timeout', 'ngToast', 'Socket',
    function($q, $timeout, ngToast, Socket){
      return {
        login: function(type){
          var _login = $q.defer();
          
          var popup = window.open('/auth/' + type, 'login');
          var timeout = window.setTimeout(function checkClosed(){
            try{
              if (popup === null || popup.closed) {
                _login.reject('cancelled');
              }else{
                timeout = window.setTimeout(checkClosed, 200);
              }
            } catch(e) { }
          }, 200);
          
          window.addEventListener('message', function messageHandler(e){
            if(e.source === popup){
              e.source.postMessage({ message: 'login:close' }, e.origin);
              window.clearTimeout(timeout);
              window.removeEventListener('message', messageHandler);
                
              if(e.data.message === 'login:success'){
                _login.resolve(e.data.user);
              } else if(e.data.message === 'login:failed'){
                _login.reject(e.data.error);
              }
              Socket.refresh();
            }
          });
          
          return _login.promise;
        },
        //This method merges a local angular model with remote mongo data without wiping references
        //Expects local and remote to be arrays
        //Good for autosaves
        mergeDocuments: function(dest, src, append){
          src = src.slice();
          
          for(var d = dest.length - 1; d >= 0; d--){
            for(var s = src.length - 1; s >= 0; s--){
              
              if(dest[d]._id == src[s]._id){
                angular.extend(dest[d], src[s]);
                src.splice(s, 1);
                break;
              }
              
              if(!append) {
                dest.splice(d, 1);
              }
            }
          }
          dest.push.apply(dest, src);
          
          return dest;
        },
        findById: function(src, id){
          for(var i = 0, l = src.length; i < l; i++ ){
            if(src[i]._id === id) { return src[i]; }
          }
        },
        permissions: {
          READ: 0,
          WRITE: 1,
          ADMIN: 2,
          OWNER: 3
        },
        action: function(promise, message, scope){
          if(scope){ scope.working = true; }
          
          function content(type, message){
            return '<i class="fa fa-' + type + '"></i> &nbsp; ' + message;
          }
          
          var working = ngToast.create({ content: content('cog fa-spin', 'Working'), dismissOnTimeout: false, class: 'info' });
          
          return promise.then(function(){
            ngToast.create({ content: content('check', message) });
          }).catch(function(error){
            ngToast.create({ content: content('exclamation-triangle', error.data), dismissButton: true, dismissOnTimeout: false, class: 'danger' });
          }).finally(function(){
            if(scope) { scope.working = false; }
            $timeout(function(){
              ngToast.dismiss(working);
            }, 500);
          });
        }
      };
    }
  ])

  .config(['$provide', '$httpProvider', function($provide, $httpProvider){
    $httpProvider.defaults.withCredentials = true;
    
    $provide.decorator('$resource', function($delegate){
      /**
       * ngResource does not provide us with any easy way to extend options passed into a resource so creating
       * subresources is very difficult. This first thing we do is store a reference to the options on $def.
       * Then we have to determine when a new instance is created (i.e. the only way a sub resource makes any sense)
       * so we wrap the hasOwnProperty method which is called during a angular.forEach call within ngResource.
       * It also just so happens that this happens before anything else so it's a good place to start. Then we
       * create new subresource objects on the prototype with extended param functions that wrap the correct
       * instance for retrieving data. The $def references allow us to do this recursively and lazily.
       *
       * TL:DR; Black.Fucking.Magic.
       *
       * --Shannon
       */
       
       
      /********************* Borrowed code from https://github.com/angular/angular.js *********************/
      var $resourceMinErr = angular.$$minErr('$resource');
  
      var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;
      
      function isValidDottedPath(path) {
        return (path !== null && path !== '' && path !== 'hasOwnProperty' &&
            MEMBER_NAME_REGEX.test('.' + path));
      }
      
      function lookupDottedPath(obj, path) {
        if (!isValidDottedPath(path)) {
          throw $resourceMinErr('badmember', 'Dotted member path "@^{0}" is invalid.', path);
        }
        var keys = path.split('.');
        for (var i = 0, ii = keys.length; i < ii && obj !== undefined; i++) {
          var key = keys[i];
          obj = (obj !== null) ? obj[key] : undefined;
        }
        return obj;
      }
      /*************************************************************************************************/
      
      return function $resource(url, params, actions){
        var resource = $delegate.apply(null, arguments);
        
        //store references to options
        resource.$def = {
          url: url,
          params: angular.copy(params) || {},
          actions: angular.copy(actions) || {},
          sub: {}
        };
        
        //we can use this to detect when a new instance has been initiated
        resource.prototype['hasOwnProperty'] = function(){
          if(!this.$def){
            
            this.$def = angular.copy(resource.$def);
            
            angular.forEach(this.$def.params, function(value, key){
              var instance = this;
              
              if(typeof value === 'string' && value.charAt(0) === '@'){
                this.$def.params[key] = function(){
                  return lookupDottedPath(instance, value.substr(1));
                };
              }
            }, this);
            
            //go through subresources and attach references
            angular.forEach(this.$def.sub, function(sub, name){
              
              sub = $resource(sub.$def.url, angular.extend({}, sub.$def.params, this.$def.params), sub.$def.actions)
                            .$subresource(sub.$def.sub);
              
              //use Object.defineProperty to avoid enumeration and subsequent deletion by ng-resource
              Object.defineProperty(this, name, {
                get: function(){
                  return sub;
                },
                configurable: true
              });
            }, this);
            
          }
          return Object.prototype.hasOwnProperty.apply(this, arguments);
        };
        
        resource.$subresource = function $subresource(subresources){
          resource.$def.sub = angular.extend({}, resource.$def.sub, subresources);
          return resource;
        };
        
        return resource;
      };
    });
  }])
;