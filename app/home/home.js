angular.module('modit.admin.home', [
  'ui.router',
  'modit.api.v1',
  'modit.api.v1.metric'
])
  
.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true).hashPrefix('!');
  $stateProvider.state('app.home', {
    url: '',
    resolve: {
      currentUser: ['CurrentUser', function(CurrentUser){
        return CurrentUser.get().$promise;
      }],
      data: ['Metric', function(Metric){
        return Metric.query({ type:'project', start: new Date(), end: new Date() });
      }]
    },
    views: {
      main: {
        controller: 'HomeCtrl',
        templateUrl: 'home.tpl.html'
      },
      usernav: {
        controller: 'UserNavCtrl',
        templateUrl: 'user-nav.tpl.html'
      }
    },
  });
})

.controller('HomeCtrl', function($scope, data, Metric) {
  $scope.data = data;
  
  $scope.metric = 'project';
  $scope.optionsCollapsed = true;
  
  $scope.rangeOptions = [
    { label: 'Today',
      start: moment().startOf('day'),
      end: moment().endOf('day')
    },
    { label: 'Yesterday',
      start: moment().subtract( 1, 'day').startOf('day'),
      end: moment().subtract( 1, 'day').endOf('day')
    },
    { label: 'This Month',
      start: moment().startOf('month'),
      end: moment().endOf('month')
    },
    { label: 'Last Month',
      start: moment().subtract( 1, 'month').startOf('month'),
      end: moment().subtract( 1, 'month').endOf('month')
    },
    { label: 'Custom',
      start: new Date(),
      end: new Date()
    }
  ];
  
  $scope.trailingOptions = [
    { label: 'Sum',
      formula: function(day, interval, property){
        var index = $scope.data.indexOf(day);
        return $scope.data.slice(index - interval + 1, index + 1).reduce(function(sum, day){
          return sum + day[property];
        }, 0);
      }
    },
    { label: 'Average',
      formula: function(day, interval, property){
        return $scope.trailingOptions[0].formula(day, interval, property) / interval;
      }
    }
  ];
  
  $scope.range = $scope.rangeOptions[0];
  $scope.method = $scope.trailingOptions[0];
  
  $scope.query = function(){
    $scope.trail = $scope.interval1 && (($scope.interval2 || $scope.interval1) - 1) || 0;
    
    
    var start = $scope.trail ? moment($scope.range.start).subtract($scope.trail, 'day') : $scope.range.start;
    $scope.data = Metric.query({ type: $scope.metric, start: start.valueOf(), end: $scope.range.end.valueOf() });
    

    $scope.columns = 1 + ($scope.interval1 && 1 || 0) + ($scope.interval1 && $scope.interval2 && 1 || 0);
    
    
    
    $scope.columnClass = 'col-xs-' + $scope.columns;
    $scope.valueClass = 'col-xs-' + (12 / $scope.columns);
    
    $scope.resultInt1 = $scope.interval1;
    $scope.resultInt2 = $scope.interval2;
  };
  
  $scope.$watch(function(){
    return $scope.metric + $scope.range.start + $scope.range.end;
  }, function(value){
    if(value){
      $scope.query();
    }
  });
  
  $scope.getTotal = function(type, section, trail){
    var rows = [].slice.call(document.querySelectorAll('[' + section + '="' + (trail || '') + '"]'));
    
    return {
      Total: function(){
        if(section === 'tot'){
          return parseFloat(rows.pop().innerHTML.replace(/,/g, ''));
        } else {
          return rows.reduce(function(total, row){
            return total += parseFloat(row.innerHTML.replace(/,/g, ''));
          }, 0);
        }
      },
      Average: function(){
        return rows.reduce(function(total, row){
          return total += parseFloat(row.innerHTML.replace(/,/g, ''));
        }, 0) / rows.length;
      },
      Maximum: function(){
        return rows.reduce(function(max, row){
          return Math.max(max, parseFloat(row.innerHTML.replace(/,/g, '')));
        }, 0);
      },
      Minimum: function(){
        return rows.reduce(function(max, row){
          return Math.min(max, parseFloat(row.innerHTML.replace(/,/g, '')));
        }, Infinity);
      }
    }[type]();
  };
})

.controller('UserNavCtrl', function($scope, currentUser, API_HOST) {
  $scope.user = currentUser;
  $scope.API_HOST = API_HOST;
  $scope.origin = window.location.origin;
})

.filter('sum', function() {
  return function(data, key) {
    if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
      return 0;
    }

    var sum = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      sum += parseInt(data[i][key]);
    }

    return sum;
  };
})

.filter('slice', function() {
  return function(arr, start, end) {
    return (arr || []).slice(start, end);
  };
})

.filter('trailing', function() {
  return function(day, method, interval, property) {
    return method.formula(day, interval, property);
  };
})
;
  