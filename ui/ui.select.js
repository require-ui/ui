/* Select下拉框控件 by liuhaiping 

用法：

//
require(['ui.select'], function(Select){

  // 第一个参数：作为弹窗内容的元素或选择器
  // 第二个参数：配置参数，可选
  var select = new Select('#roleList', {

    // AJAX获取远程数据的地址；也可以用data属性来显示本地数据，见下文；
    url: 'data/roles.js',

    // AJAX方法，可选，且仅在定义了url时有效
    method: 'POST',

    // AJAX参数，可选，且仅在定义了url时有效
    params: {
      page: 1,
      pageSize: 9999,
    },

    // 在定义了url的情况下，data可以是一个函数，用于处理AJAX返回的数据
    // 在没有定义url的情况下，data可以是直接是一个对象数组；
    // 对象数据的格式应该为：
    //     [{ roleId: '1', roleName: '管理员'},{}, ..]
    data: function(json){
      return json.data;
    },
    
    // 下拉框的值字段
    valueField: 'roleId',

    // 下拉框的显示字段
    textField: 'roleName',

    // 插入的数据，可选
    insertData: [{
      value: '',
      text: '请选择'
    }]

  });

});

*/
define(['jquery', 'ui.widget', 'ui.ajax'], 
  function($, WidgetBase, Ajax){
 
  // 待实现功能：

  var Widget;

  var proto = {

    // 默认配置
    defaults: {
      insertData: []
    },

    // 初始化
    init: function(){

      var self = this;

      // 加载本地或者远程数据
      if(this.config.autoLoad !== false) this.reload();

      this.target.on('change', function(){
        self.fire('change', {
          newVal: self.target.val()
        });
      });

      return this;
    },

    reload: function(cfg, callback, selectId){
      var self = this;
      // 加载本地或者远程数据
      Ajax.loadJSON($.extend({}, this.config, cfg), function(data){
        self.loadData(data, selectId);
        //
        if($.isFunction(callback)){
          callback.call(self, data);
        };
      });
    },

    // 加载数据
    loadData: function(data, selectId){

      var self = this,
        tag = this.target, 
        cfg = this.config;

      var rows = [];
      var val, txt, options = '';

      // insertData
      $.each(cfg.insertData, function(index, row){
        val = row.value;
        txt = row.text;
        options += '<option value="' + val + '">' + 
          txt + '</option>';
      });

      // 数据
      $.each(data, function(index, row){
        val = row[cfg.valueField];
        txt = row[cfg.textField];
        options += '<option value="' + val + '" ' + 
            (selectId == val ? 'selected="selected"' : '') + '>' + 
          txt + '</option>';
      });

      //
      tag.html(options);
    },

    select: function(id){

      var self = this,
        tag = this.target, 
        cfg = this.config;

      tag.val(id);
    },

    clear: function(id){

      var self = this,
        tag = this.target, 
        cfg = this.config;

      this.loadData([]);
    }

  };

  Widget = WidgetBase.create(proto);

  return Widget;
});