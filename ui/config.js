(function(){

  // 取fn.path
  var scripts = document.getElementsByTagName('script');
  var loaderScript = scripts[scripts.length - 1];
  //
  var pageUrl = location.href.split('?')[0];
  var pageDir = pageUrl.replace(/[^\/]+$/, '');
  //
  var uiDir = loaderScript.src.split(/config\.js\??/)[0];
  var scriptQS = loaderScript.src.split('?')[1] || '';
  //
  var base = (scriptQS.match(/\bbase=([^\b]*)/) || [])[1] || '';
  var $root$ = pageDir + base;

  var paths = {

    // lib
      "d3": "lib/d3/d3"
    , "lodash": "lib/lodash/lodash"
    , "jquery": "lib/jquery/jquery"
    , "moment": "lib/moment/moment"
    , "mustache": "lib/mustache/mustache"

    // ui
    , "ui": "ui"
    
    , "ui.ajax": "ui.ajax"
    , "ui.event": "ui.event"
    , "ui.klass": "ui.klass"
    , "ui.widget": "ui.widget"

    , "ui.grid": "ui.grid"
    , "layout": "widget/layout/layout"
    , "ui.select": "ui.select"
    , "ui.msg": "ui.msg"
    , "ui.where.conditions": "ui.where.conditions"
    , "ui.hive.conditions": "ui.hive.conditions"
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
        "exports": "jQuery"
      }
    }
  }
  //CONFIG
  );

}());