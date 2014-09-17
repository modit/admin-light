<?php require "${_SERVER['DOCUMENT_ROOT']}/hosts.php"; ?>
<!DOCTYPE html>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-route.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-sanitize.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-animate.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.2.21/angular-resource.min.js"></script>

<script src="common/angular-import.js"></script>

<link href="common/modit-core.php" rel="import">

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
<link rel="stylesheet" href="app.css" />
<template id="app.tpl.html">
  <div class="header col-lg-12">
    <a ui-sref="app.home" ui-sref-opts="{ inherit: false }" class="pull-left">
      <img class="modit-logo img-responsive" ng-src="{{logo}}" >
    </a>
    <div ui-view="usernav"></div>
  </div>
  
  <div ui-view="main" class="main"></div>
</template>


<link href="welcome/" rel="import">
<link href="home/" rel="import">