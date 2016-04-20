define(['jquery', 'layout'], function($, Layout){

  var div = $('<div class="msg">').appendTo('body');

  var layout = new Layout(div, {
    modal: false
  });

  var Msg = function(msg, cfg){

    cfg || (cfg = {});
    
    div.html(msg);
    layout.target.css({
      color: {
        'error': '#FF0000',
        'warn': '#FF6600'
      }[cfg.type] || 'inherit'
    });

    layout.show();
  };

  Msg.error = function(msg, cfg){

    cfg || (cfg = {});
    
    cfg.type = 'error';
    Msg(msg, cfg);
  };

  Msg.warn = function(msg, cfg){

    cfg || (cfg = {});
    
    cfg.type = 'warn';
    Msg(msg, cfg);
  };

  return Msg;

});