angular.module('modit.api.http', [])
  .provider('apiHTTP', function(){

    this.$get = ['$http', '$q', function($http, $q){

      function HTTP(server){
        this.server = server;
      }

      HTTP.prototype = {
        transmit: function(method, action, options, raw){
          var deferred = $q.defer();
          return $http[method](this.server + '/api/' + action, options, raw ? {
            withCredentials: true,
            transformResponse: function(data){
              return data;
            }
          }: { withCredentials: true });
        },
        upload: function upload(action, file, data){
          var http = this;
          var deferred = $q.defer();

          var chunk = 1024 * 1024;
          var sendChunk = function(offset, id) {
            console.log('sending chunk ', offset);
            var place = offset * chunk; //The Next Blocks Starting Position
            var blob = new Blob([file], { type : file.type, name: file.name });
            var nFile = blob.slice(place, place + Math.min(chunk, (file.size - place)));

            var formData = new FormData();
            formData.append('data', JSON.stringify(data));
            formData.append('file', nFile, file.name);

            sendData(formData, offset, id);
          };

          var sendData = function(formData, offset, id){
            var xhr = new XMLHttpRequest();
            var post = http.server + '/api/' + action + '?uploadSize=' + file.size;
            xhr.open("POST", post + (id ? '&uploadId=' + id: ''));
            xhr.addEventListener("load", function(){

              var response = {
                status: xhr.status,
                headers: xhr.headers
              };

              try{
                response.data = JSON.parse(xhr.response);
              }catch(e){
                response.status = 406;
                response.data = { error: 'Invalid Response' };
              }

              if(response.status === 202){
                sendChunk(offset + 1, response.data.uploadId);
              }else{
                deferred.resolve(response);
              }

            }, false);
            xhr.withCredentials = true;
            xhr.send(formData);
          };

          sendChunk(0);

          var promise = deferred.promise.then(function(response){
            if(response.status == 200) {
              return response;
            } else {
              return $q.reject(response);
            }
          });

          //Simulate $http responses
          promise.success = function(fn) {
            promise.then(function(response) {
              fn(response.data, response.status, response.headers);
            });
            return promise;
          };

          promise.error = function(fn) {
            promise.then(null, function(response) {
              fn(response.data, response.status, response.headers);
            });
            return promise;
          };

          return promise;
        },
        post: function post(action, data, raw){
          // Post actions require login
          return this.transmit('post', action, {
            data: data,
            withCredentials: true
          }, raw);
        },
        get: function get(action, data, raw){
          return this.transmit('get', action, {
            params: data,
            withCredentials: true
          }, raw);
        },
        query: function(model, query){
          return this.post('query', { model: model, query: query });
        },
        findById: function(model, id) {
          return this.post('query-one', { model: model, query: { filter: { _id: id } } });
        }
      };

      return HTTP;
    }];
  })
  /**
  * We need this patch for not stripping certain keys that start with $ in http requests.
  * This is needed for working with MongoDB queries
  */
  // .run(['$document', '$http',
  //   function ($document, $http) {
  //     var MongoOperators = ["$gt", "$gte", "$in", "$lt", "$lte", "$ne", "$nin",
  //                           "$or", "$and", "$not", "$nor",
  //                           "$exists", "$type",
  //                           "$mod", "$regex", "$where",
  //                           "$geoWithin", "$geoIntersects", "$near", "$nearSphere",
  //                           "$all", "$elemMatch", "$size",
  //                           "$", "$slice", "$oid"];

  //     var toJsonReplacer = function(key, value) {
  //         var val = value;

  //         if (/^\$+/.test(key) && MongoOperators.indexOf(key) === -1) {
  //             val = undefined;
  //         } else if (value && value.document && value.location && value.alert && value.setInterval) {
  //             val = '$WINDOW';
  //         } else if (value && $document === value) {
  //             val = '$DOCUMENT';
  //         } else if (value && value.$evalAsync && value.$watch) {
  //             val = '$SCOPE';
  //         }
  //         return val;
  //     };

  //     angular.toJson = function(obj, pretty) {
  //         return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
  //     };

  //     $http.defaults.transformRequest = function(d) {
  //         return angular.isObject(d) && (angular.toString.apply(d) !== '[object File]') ? angular.toJson(d) : d;
  //     };
  //   }
  // ])
;
