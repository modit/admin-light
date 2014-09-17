angular.module('modit.api.auth', ['modit.api.http'])
  .provider('apiAuth', function(){
    this.server = '';
    
    this.$get = ['$q', 'apiHTTP', function($q, apiHTTP){
      var http = new apiHTTP(this.server);
      var element = this.element;
      
      var _login = $q.defer();
      var _userdata = null;
      var _modal = null;
      
      function login(type){
        _login = $q.defer();
        
        var popup = window.open(http.server + '/auth/' + type, 'login');
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
          if(e.source === popup && e.data.message === 'login:success'){
            //Cleanup
            e.source.postMessage({ message: 'login:close' }, e.origin);
            window.clearTimeout(timeout);
            window.removeEventListener('message', messageHandler);
            
            _login.resolve(e.data.user);
          }
        });
        
        return _login.promise;
      }
      
      return {
        getUser: function(){
          if(_userdata) {
            return $q.when(_userdata);
          }
          
          return http.get('get-user').then(function(result){
            _userdata = result.data;
            return _userdata;
          });
        },
        getUserId: function(){
          return this.getUser().then(function(user){
            if(user) {
              return user._id;
            }
          });
        },
        login: login,
        logout: function(){
           _userdata = null;
          return http.get('destroy-session');
        }
      };
      
    }];
    
    this.setServer = function(server){
      this.server = server;
    };
    
    this.setElement = function(element){
      this.element = element;
    };
  });
