<?php require "${_SERVER['DOCUMENT_ROOT']}/hosts.php"; ?>
<!DOCTYPE html>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-route.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-sanitize.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-animate.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-resource.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.4.13/d3.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/c3/0.3.0/c3.js"></script>
<link href="//cdnjs.cloudflare.com/ajax/libs/c3/0.3.0/c3.css" rel="stylesheet">

<link href="common/modit-core.php" rel="import">

<script src="common/angular-import.js"></script>
<script src="common/api/v1/metric.js"></script>

<link rel="stylesheet" href="app.css" />
<script src="app.js"></script>
<script>
  angular.module('modit.api.v1')
    .config(function(ApiConfigProvider){
      ApiConfigProvider.set({
        base: '//<?= $API_HOST ?>/api/v1'
      })
    })
  ;
  
  angular.module('modit.admin')
    .constant('CORE_HOST',  '<?= $CORE_HOST ?>')
    .constant('API_HOST',   '<?= $API_HOST ?>')
  ;
</script>

<template id="app.tpl.html">
  <div class="admin-header col-lg-12">
    <a ng-href="//{{CORE_HOST}}" class="pull-left">
      <img class="modit-logo" ng-src="{{logo}}" >
      
    </a>
    <span class="pull-left text-warning text-large admin-tag"><b>Admin</b></span>
    
    <div ui-view="usernav"></div>
  </div>
  
  <div ui-view="main" class="admin-main col-lg-12"></div>
</template>


<link href="welcome/" rel="import">
<link href="home/" rel="import">