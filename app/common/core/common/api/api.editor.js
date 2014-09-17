angular.module('modit.api.editor', ['modit.api.http'])
  .provider('apiEditor', function(){
    this.server = '';

    this.$get = ['apiHTTP', function(apiHTTP){
      var http = new apiHTTP(this.server);

      return {
        listProjects: function(){
          return http.post('list-projects');
        },
        createBranch: function(project){
          return http.post('create-branch', { project: project });
        },
        listBranches: function(project){
          return http.post('list-branches', { project: project });
        },
        listRevisions: function(branch){
          return http.post('list-revisions', { branch: branch });
        },
        getBranch: function(branch){
          return http.post('get-branch', { branch: branch });
        },
        getRevision: function(revision){
          return http.post('get-revision', { revision: revision });
        },
        createFile: function(branch, path, contents, mime){
          return http.post('create-file', { branch: branch, path: path, contents: contents, mime: mime });
        },
        deletePath: function(branch, path){
          return http.post('delete-path', { branch: branch, path: path });
        },
        movePath: function(branch, path, to){
          return http.post('move-path', { branch: branch, path: path, to: to });
        },
        forkRevision: function(revision){
          return http.post('fork-revision', { revision: revision });
        },
        commitBranch: function(branch, message){
          return http.post('commit-branch', { branch: branch, message: message });
        },
        createDirectory: function(branch, path){
          return http.post('create-directory', { branch: branch, path: path });
        },
        setMetadata: function(branch, data){
          return http.post('set-metadata', { branch: branch, data: data });
        },
        uploadFile: function(branch, path, file, unpack){
          return http.upload('upload-file', file, {branch: branch, path: path, unpack: unpack });
        },
        readFile: function(revision, path){
          return http.post('read-file', { revision: revision, path: path }, true);
        }
      };
    }];
    this.setServer = function(server){
      this.server = server;
    };
  });