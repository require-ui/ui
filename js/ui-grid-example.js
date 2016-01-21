//
require(['jquery', 'ui.grid'], function($, Grid){

  var tag1 = $('a[href$=tag1]').hide();
  var div = $('<table></table>').insertAfter(tag1);

  var grid = new Grid(div, {

    data: [{
      id: 0,
      name: 'hap',
      email: 'mailhap@qq.com'
    },{
      id: 1,
      name: 'adj',
      email: 'mailadj@qq.com'
    }],

    columns: [
      { key: 'id', label: 'id' },
      { key: 'name', label: '姓名' },
      { key: 'email', label: '邮箱' },
      { key: 'action', label: '操作', 

        formatter: function(row, col){
          return '<a href="delUser(' + row.id + '):;">删除</a>';
        } 
      }
    ]
  });
 

});