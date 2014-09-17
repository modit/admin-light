angular.module('templateImport', [])
  .run(function($templateCache){
    var links = [].slice.call(document.querySelectorAll('link[rel=import]'));
    var link, template;
    
    while(links.length){
      link = links.shift();
      
      if(link.import){
        var templates = [].slice.call(link.import.querySelectorAll('script[type="text/ng-template"], template'));
        
        while(templates.length){
          template = templates.shift();
          $templateCache.put(template.id, template.innerHTML);
        }
        
        if(window.less){
          var lessSheets = [].slice.call(link.import.querySelectorAll('link[rel="stylesheet/less"]'));
          while(lessSheets.length){
            less.sheets.push(lessSheets.shift());
            less.refresh();
          }
        }
        
        links.push.apply(links, link.import.querySelectorAll('link[rel=import]'));
      }
    }
  })
;