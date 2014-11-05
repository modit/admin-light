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

.controller('HomeCtrl', function($scope, $filter, data, Metric) {
  $scope.colorMap = {
    'new': '#95bc11',
    'new-t1': $filter('shade')('#95bc11', 50),
    'new-t2': $filter('shade')('#95bc11', -50),
    'deleted': '#c53d12',
    'deleted-t1': $filter('shade')('#c53d12', 50),
    'deleted-t2': $filter('shade')('#c53d12', -50),
    'total': '#10889e',
    'total-t1': $filter('shade')('#10889e', 50),
    'total-t2': $filter('shade')('#10889e', -50)
  };
  
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
        return Math.round($scope.data.slice(index - interval + 1, index + 1).reduce(function(sum, day){
          return sum + day[property];
        }, 0));
      }
    },
    { label: 'Average',
      formula: function(day, interval, property){
        return Math.round(($scope.trailingOptions[0].formula(day, interval, property) / interval));
      }
    }
  ];
  
  $scope.range = $scope.rangeOptions[2];
  $scope.method = $scope.trailingOptions[1];
  $scope.interval1 = 7;
  $scope.interval2 = 30;
  $scope.optionsCollapsed = false;
  
  $scope.query = function(){
    $scope.trail = $scope.interval1 && (($scope.interval2 || $scope.interval1) - 1) || 0;
    
    
    var start = $scope.trail ? moment($scope.range.start).subtract($scope.trail, 'day') : $scope.range.start;
    $scope.data = Metric.query({ type: $scope.metric, start: start.valueOf(), end: $scope.range.end.valueOf() });
    

    $scope.columns = 1 + ($scope.interval1 && 1 || 0) + ($scope.interval1 && $scope.interval2 && 1 || 0);
    
    $scope.columnClass = 'col-xs-' + $scope.columns;
    $scope.valueClass = 'col-xs-' + (12 / $scope.columns);
    
    $scope.resultInt1 = $scope.interval1;
    $scope.resultInt2 = $scope.interval2;
    
    $scope.data.$promise.then(function(data){
      data = data.slice($scope.trail);
      
      var columns = [
        ['x'].concat(data.map(function(data){
          return new Date(data.date);
        }))
      ];
      
      var pattern = [];
      
      var axes = { total: 'y2' };
      
      //{{day | trailing:method:resultInt1:'deleted' | number}}
      ['new', 'deleted', 'total'].forEach(function(prop){
        
        columns.push([prop].concat(data.map(function(day){
          return day[prop];
        })));
        
        pattern.push($scope.colorMap[prop]);
        
        if($scope.resultInt1 && !(prop === 'total' && $scope.method.label === 'Sum')){
          columns.push([prop + '-' + $scope.resultInt1 + 'd'].concat(data.map(function(day){
            return $scope.method.formula(day, $scope.resultInt1, prop);
          })));
          
          pattern.push($scope.colorMap[prop + '-t1']);
          if(prop === 'total'){
            axes['total-' + $scope.resultInt1 + 'd'] = 'y2';
          }
        }
        
        if($scope.resultInt2 && !(prop === 'total' && $scope.method.label === 'Sum')){
          columns.push([prop + '-' + $scope.resultInt2 + 'd'].concat(data.map(function(day){
            return $scope.method.formula(day, $scope.resultInt2, prop);
          })));
          
          pattern.push($scope.colorMap[prop + '-t2']);
          if(prop === 'total'){
            axes['total-' + $scope.resultInt2 + 'd'] = 'y2';
          }
        }
      });
      
      $scope.chart = {
        data: {
          x: 'x',
          columns: columns,
          axes: axes
        },
        color: {
          pattern: pattern
        },
        axis: {
          x: {
            type : 'timeseries',
            tick: {
              format: function (x) { return moment(x).format('M/D'); }
            }
          },
          y: {
            
          },
          y2: {
            show: true,
            label: { // ADD
              text: 'Total',
              position: 'outer-middle'
            }
          }
        }
      };
    });
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

.filter('shade', function(){
  return function(col, amt){
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
  };
})

.directive('moditChart', function(){
  return {
    restrict: 'A',
    scope: {
      chart: '=moditChart'
    },
    link: function(scope, elem, attrs){
      scope.$watch('chart', function(chart){
        if(chart){
          c3.generate(angular.extend(chart, { bindto: elem[0]}));
        }
      });
    }
  };
})
;
  