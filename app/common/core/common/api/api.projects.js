angular.module('modit.api.projects', ['modit.api.http', 'modit.api.model'])
  .provider('apiProjects', function(){
    this.server = '';
    this.io = io.connect();

    this.$get = ['$rootScope', 'apiHTTP', 'apiModel', function($rootScope, apiHTTP, apiModel){
      var http = new apiHTTP(this.server);
      var io = this.io;
      
      io.on('connect', function(event){
        $rootScope.$broadcast('io:connect', event);
      });

      return {
        createProject: function(metadata, owner){
          return http.post('create-project', { metadata: metadata, owner: owner });
        },
        updateProject: function(project, metadata){
          return http.post('update-project', { project: project, metadata: metadata });
        },
        updateProjectRepo: function(project, url){
          return http.post('update-project-repo', { project: project, url: url });
        },
        updateProfile: function(profile, organization) {
          return http.post('update-profile', { profile: profile, organization: organization });
        },
        updateProtoBranch: function(proto, branch) {
          return http.post('update-proto-branch', { proto: proto, branch: branch });
        },
        updateProto: function(proto, metadata){
          return http.post('update-proto', { proto: proto, metadata: metadata });
        },
        listProjects: function(owner){
          return http.post('list-projects', { owner: owner });
        },
        listProtos: function(project, query) {
          return http.post('list-protos', { project: project, query: query });
        },
        listBranchProtos: function(project, proto) {
          return http.post('list-branch-protos', { project: project, proto: proto });
        },
        getProject: function(project){
          return http.post('get-project', { project: project });
        },
        getProto: function(project, proto){
          return http.post('get-proto', { project: project, proto: proto });
        },
        getServiceLogs: function(proto, service, type){
          return http.post('get-service-logs', { proto: proto, service: service, type: type });
        },
        getProjectFeed: function(project, query) {
          return http.post('get-project-feed', { project: project, query: query });
        },
        getProtoFeed: function(project, proto) {
          return http.post('get-proto-feed', { project: project, proto: proto });
        },
        listComments: function(project, proto) {
          return http.post('list-comments', { project: project, proto: proto });
        },
        getUser: function(user) {
          return http.post('get-user', { user: user });
        },
        getUserFeed: function() {
          return http.post('get-user-feed');
        },
        getProjectPermissions: function(project) {
          return http.post('get-project-permissions', { project: project });
        },
        getTeamPermissions: function(team) {
          return http.post('get-team-permissions', { team: team });
        },
        postComment: function(content, topic, id) {
          //TODO: fix comment coming back with no id
          var data = { content: content, topic: topic };
          data[topic.toLowerCase()] = id;
          return http.post('post-comment', data);
        },
        createWebhook: function(type, project) {
          return http.post('create-webhook', { type: type, project: project });
        },
        listRepos: function() {
          return http.post('list-repos');
        },
        listBranches: function(project) {
          return http.post('list-branches', { project: project });
        },
        tallyBranches: function(project) {
          return http.post('tally-branches', { project: project });
        },
        tallyAuthors: function(project) {
          return http.post('tally-authors', { project: project });
        },
        searchUsers: function(search){
          return http.post('search-users', { search: search });
        },
        sendInvite: function(email){
          return http.post('send-invite', { email: email });
        },
        requestBetaInvite: function(email, reason){
          return http.post('request-beta-invite', { email: email, reason: reason });
        },
        addCollaborator: function(project, user){
          return http.post('add-collaborator', { project: project, user: user });
        },
        removeCollaborator: function(project, user){
          return http.post('remove-collaborator', { project: project, user: user });
        },
        getCollaborators: function(project){
          return http.post('get-collaborators', { project: project });
        },
        addTeam: function(project, team){
          return http.post('add-team', { project: project, team: team });
        },
        removeTeam: function(project, team){
          return http.post('remove-team', { project: project, team: team });
        },
        getTeams: function(organization){
          return http.post('get-teams', { organization: organization });
        },
        addMember: function(team, member){
          return http.post('add-member', { team: team, member: member });
        },
        removeMember: function(team, member){
          return http.post('remove-member', { team: team, member: member });
        },
        getOrganizations: function(user){
          return http.post('get-organizations', { user: user });
        },
        getVariables: function(project) {
          return http.post('get-variables', { project: project });
        },
        setVariables: function(project, variables) {
          return http.post('set-variables', { project: project, variables: variables });
        },
        startProto: function(proto){
          return http.post('start-proto', { proto: proto });
        },
        stopProto: function(proto){
          return http.post('stop-proto', { proto: proto });
        },
        verifyUsername: function(username){
          return http.post('verify-username', { username: username });
        },
        verifyProjectName: function(name, user){
          return http.post('verify-project-name', { name: name, user: user });
        },
        verifyTeamName: function(name, organization){
          return http.post('verify-team-name', { name: name, organization: organization });
        },
        createOrganization: function(name, email, plan, card){
          return http.post('create-organization', { name: name, email: email, plan: plan, card: card });
        },
        createTeam: function(organization, metadata, permissions){
          return http.post('create-team', { organization: organization, metadata: metadata, permissions: permissions });
        },
        deleteTeam: function(team){
          return http.post('delete-team', { team: team });
        },
        updateTeam: function(team, metadata, permissions){
          return http.post('update-team', { team: team, metadata: metadata, permissions: permissions });
        },
        getAccount: function(organization){
          return http.post('get-account', { organization: organization });
        },
        getPlans: function(){
          return http.get('get-plans');
        },
        updateBillingEmail: function(email, organization){
          return http.post('update-email', { email: email, organization: organization });
        },
        updatePaymentMethod: function(card, organization){
          return http.post('update-payment-method', { card: card, organization: organization });
        },
        updatePlan: function(plan, organization){
          return http.post('update-plan', { plan: plan, organization: organization });
        },
        subscribe: function(target, scope){
          var api = this;
          
          io.emit('api:subscribe', { target: target });
          io.removeAllListeners('activity:' + target);
          
          io.on('activity:' + target, function(data) {
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
          io.emit('api:unsubscribe', { target : target });
          io.removeAllListeners('activity:' + target);
        }
      };
    }];

    this.setServer = function(server){
      this.server = server;
    };
  });