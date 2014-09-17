angular.module('modit.api', ['modit.api.auth', 'modit.api.editor', 'modit.api.projects', 'modit.api.habitats', 'modit.api.query'])
  .factory('apiService', ['apiAuth', 'apiEditor', 'apiProjects', 'apiHabitats', 'apiQuery',
    function(apiAuth, apiEditor, apiProjects, apiHabitats, apiQuery){
      //This method merges a local angular model with remote mongo data without wiping references
      //Expects local and remote to be arrays
      //Good for autosaves
      function mergeDocuments(dest, src, append){
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
      }
      
      function findById(src, id){
        for(var i = 0, l = src.length; i < l; i++ ){
          if(src[i]._id === id) { return src[i]; }
        }
      }
      
      return {
        auth: apiAuth,
        editor: apiEditor,
        projects: apiProjects,
        habitats: apiHabitats,
        mergeDocuments: mergeDocuments,
        findById: findById,
        Query: apiQuery,
        permissions: {
          READ: 0,
          WRITE: 1,
          ADMIN: 2,
          OWNER: 3
        }
      };
    }
  ])
;