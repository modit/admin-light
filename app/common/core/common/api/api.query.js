angular.module('modit.api.query', [])
  .factory('apiQuery', function(){
    
    function Query(options){
      this.filter = {};
      this.sort = {};
      this.skip = {};
      this.limit = {};
    }

    Query.prototype = {
      equalTo: function(field, value){
        this.filter[field] = value;
        return this;
      },
      notEqualTo: function(field, value){
        this.filter[field] = { $ne: value };
        return this;
      },
      "in": function(field, values){
        this.filter[field] = { $in: values };
        return this;
      },
      notIn: function(field, values){
        this.filter[field] = { $nin: values };
        return this;
      },
      all: function(field, values){
        this.filter[field] = { $all: values };
        return this;
      },
      exists: function(field, flag){
        this.filter[field] = { $exists: flag };
        return this;
      },
      ascending: function(field){
        this.sort[field] = 1;
        return this;
      },
      descending: function(field){
        this.sort[field] = -1;
        return this;
      },
      toJSON: function(){
        return {
          filter: this.filter,
          sort: this.sort,
          skip: this.skip,
          limit: this.limit
        };
      }
    };
    
    return Query;
  });