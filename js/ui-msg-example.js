//
require(['jquery', 'ui.msg'], function($, Msg){
  //
  $('a[href$=showMsg]').click(function(){
    new Msg('这是一条提示信息');
  });

  //
  $('a[href$=showWarn]').click(function(){
    new Msg('这是一条警告信息');
  });

  //
  $('a[href$=showError]').click(function(){
    new Msg('这是一条错误信息');
  });

});