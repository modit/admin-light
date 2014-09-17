angular.module('modit.api.model', [])
  .factory('apiModel', function(){
    
    function Model(http, name, methods){
      this.http = http;
      this.name = name;
      
      if(methods) {
        angular.forEach(methods, function(method, name){
          this[name] = method;
        }, this);
      }
    }
    
    Model.prototype = {
      query: function(query){
        return this.http.query(this.name, query);
      },
      findById: function(id){
        return this.http.findById(this.name, id);
      },
      create: function(data){
        return this.http.post('create-' + this.name, data);
      },
      update: function(data){
        return this.http.post('update-' + this.name, data);
      }
    };
    
    return Model;
  });