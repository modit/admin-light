angular.module('modit.api.habitats', ['modit.api.http', 'modit.api.model'])
  .provider('apiHabitats', function(){
    this.server = '';

    this.$get = ['apiHTTP', 'apiModel', function(apiHTTP, apiModel){
      var http = new apiHTTP(this.server);

      return {
        //===Release=============================================
        createRelease: function(project, revision, type){
          return http.post('create-release', { project: project, revision: revision, type: type });
        },
        editConfig: function(config, containers){
          return http.post('edit-config', { config: config, containers: containers });
        },
        promoteConfig: function(config){
          return http.post('promote-config', { config: config });
        },
        promoteRelease: function(release, config){
          return http.post('promote-release', { release: release, config: config });
        },
        listReleases: function(project, options){
          return http.post('list-releases', { project: project, options: options });
        },
        getRelease: function(release){
          return http.post('get-release', { release: release });
        },
        getPreviewRelease: function(revision){
          return http.post('get-preview-release', { revision: revision });
        },
        setReleaseMetadata: function(release, data){
          return http.post('set-release-metadata', { release: release, data: data  });
        },
        //---Release Commands-------------------------------------------------------
        buildRelease: function(release, options){
          return http.post('build-release', { release: release, options: options });
        },
        startRelease: function(release, options){
          return http.post('start-release', { release: release, options: options });
        },
        stopRelease: function(release, options){
          return http.post('stop-release', { release: release, options: options });
        },
        commitRelease: function(release, options){
          return http.post('commit-release', { release: release, options: options });
        },
        cleanRelease: function(release, options){
          return http.post('clean-release', { release: release, options: options });
        },
        restoreRelease: function(release, options){
          return http.post('restore-release', { release: release, options: options });
        },
        syncRelease: function(release){
          return http.post('sync-release', { release: release });
        },
        //===Image===============================================
        listImages: function(options){
          return http.post('list-images', { options: options });
        },
        //===Database==================================================
        createDatabase: function(project, image, metadata){
          return http.post('create-database', { project: project, image: image, metadata: metadata });
        },
        //===Alias===============================================
        createAlias: function(project, releases, premium){
          return http.post('create-alias', { project: project, releases: releases, premium: premium });
        },
        editAlias: function(alias, releases){
          return http.post('edit-alias', { alias: alias, releases: releases });
        },
        deleteAlias: function(alias){
          return http.post('delete-alias', { alias: alias });
        },
        listAliases: function(project, options){
          return http.post('list-aliases', { project: project, options: options });
        },
        checkAliasAvailability: function(alias){
          return http.post('check-alias-availibility', { alias: alias });
        },
        //===Logs================================================
        buildLog: function(release, container){
          return http.post('build-log', { release: release, container: container });
        },
        runtimeLog: function(release, container){
          return http.post('runtime-log', { release: release, container: container });
        }
      };
    }];

    this.setServer = function(server){
      this.server = server;
    };
  });
