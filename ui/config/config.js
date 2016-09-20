(function(){

  // 取fn.path
  var scripts = document.getElementsByTagName('script');
  var loaderScript = scripts[scripts.length - 1];
  //
  var pageUrl = location.href.split('?')[0];
  var pageDir = pageUrl.replace(/[^\/]+$/, '');
  //
  var uiDir = loaderScript.src.split(/config\/config\.js\??/)[0];
  var scriptQS = loaderScript.src.split('?')[1] || '';
  //
  var base = (scriptQS.match(/\bbase=([^\b]*)/) || [])[1] || '';
  var $root$ = pageDir + base;

  var paths = {

    // lib
      "d3": "lib/d3/d3"
    , "lodash": "lib/lodash/lodash"
    , "jquery": "lib/zepto/zepto"
    , "moment": "lib/moment/moment"
    , "mustache": "lib/mustache/mustache"

    // ui
    , "ui": "ui"
    
    , "ajax": "widget/ajax/ajax"
    , "event": "widget/event/event"
    , "klass": "widget/klass/klass"
    , "widget": "widget/widget/widget"

    , "layout": "widget/layout/layout"
    , "grid": "widget/grid/grid"
    , "select": "widget/select/select"
    , "msg": "widget/msg/msg"
    , "where.conditions": "widget/where.conditions/where.conditions"
    , "hive.conditions": "widget/hive.conditions/hive.conditions"
  };

  // uiDir
  for(var name in paths) if(paths.hasOwnProperty(name)){
    paths[name] = uiDir + paths[name];
  };

  requirejs.config(
  //CONFIG
  {
    "baseUrl": $root$,
    "paths": paths,
    "shim": {
      "d3": {
        "exports": "d3"
      },
      "jquery": {
        "exports": "$"
      }
    },
    map: {
      '*': {
        'css': uiDir + 'lib/require-css/css.js' // or whatever the path to require-css is
      }
    }
  }
  //CONFIG
  );

}());