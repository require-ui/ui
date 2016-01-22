define(['jquery'], function($){

  var Ajax = {

    // 加载本地或者远程数据
    loadJSON: function(cfg, callback){

      //
      callback || (callback = function(){});

      // 远程数据
      if(cfg.url){
        // URL 
        $.ajax({
          url: cfg.url,
          method: cfg.method || 'get',
          dataType: 'json',
          data: cfg.params || '',
          success: function(json){
            var data;
            if($.isFunction(cfg.data)){
              data = cfg.data(json);
            }else{
              data = json;
            };
            callback(data, json);
          },
          failure: function(){
            callback([]);
          }
        });
      }else if(cfg.data){
        // 本地数据
        var data;
        if($.isFunction(cfg.data)){
          data = cfg.data();
        }else{
          data = cfg.data;
        };
        callback(data);
      }else{
        throw 'ui.ajax.loadJSON need param: url or data';
      };

    } // end loadJSON

  };

  return Ajax;

});