/* Where条件控件 by liuhaiping 

用法：

//
require(['ui.hive.conditions'], function(WhereConditions){



});

*/

define(['jquery', 'mustache', 'ui.widget', 'ui.ajax'], 
  function($, Mustache, WidgetBase, Ajax){

  var Widget;

  var TPL_THEAD_TRS =
    '<tr>' +
    '  <td>字段</td>' +
    '  <td>比较符</td>' +
    '  <td>值</td>' +
    '  <td><a class="add" href="javascript:;">+</a></td>' +
    '</tr>';

  var TPL_TBODY_TRS = 
    '<tr>' +
    '<td class="">{{{field}}}</td>' +
    '<td class="">{{{operator}}}</td>' +
    '<td class="">{{{value}}}</td>' +

    '<td class="remove">' +
    '  <a class="remove" href="javascript:;">-</a>' +
    '</td>' +
    '</tr>';

  var TPL_LOGIC_SELECT = 
    '<select name="logic">' +
    '  <option value="">&nbsp;</option>' +
    '  <option value="and" selected="selected">AND</option>' +
    '  <option value="or">OR</option>' +
    '</select>';

  var TPL_FIELD_SELECT = 
    '<select name="field">' +
    '  <option value="">请选择</option>' +
    '</select>';

  var TPL_OPERATORS_SELECT = 
    '<select name="operator">' +
    '  <option value="equals">equals</option>' +
    '  <option value="notequals">notequals</option>' +
    '  <option value="greaterthan">greaterthan</option>' +
    '  <option value="greaterthanequals">greaterthanequals</option>' +
    '  <option value="lessthan">lessthan</option>' + 
    '  <option value="lessthanequals">lessthanequals</option>' +
    '</select>';

  var TPL_VALUE_INPUT = 
    '<input type="text" name="value"/>';

  var TPL_LEFT_BRACKET_SELECT = 
    '<select name="leftBracket">' +
    '  <option value="">&nbsp;</option>' +
    '  <option value="(">(</option>' +
    '</select>';

  var TPL_MID_BRACKET_SELECT = 
    '<select name="midBracket">' +
    '  <option value="">&nbsp;</option>' +
    '  <option value="(">(</option>' +
    '</select>';

  var TPL_RIGHT_BRACKET_SELECT = 
    '<select name="rightBracket">' +
    '  <option value="">&nbsp;</option>' +
    '  <option value=")">)</option>' +
    '  <option value="))">))</option>' +
    '</select>';

  var proto = {

    // 默认配置
    defaults: {

    },

    // 初始化
    init: function(){

      var self = this;
      var tag = this.target, cfg = this.config;
      var thead, tbody;

      this.fields = cfg.fields || [];

      // add class
      tag.addClass('ui-hive-conditions');
      tag.html('<thead></thead><tbody></tbody>');

      // thead
      thead = tag.find('thead');
      thead.html(Mustache.render(TPL_THEAD_TRS, {}));

      // tbody
      tbody = tag.find('tbody');

      // 添加行
      tag.on('click', '.add', function(){
        var tr = Mustache.render(TPL_TBODY_TRS, {
          leftBracket: TPL_LEFT_BRACKET_SELECT,
          logic: TPL_LOGIC_SELECT,
          midBracket: TPL_MID_BRACKET_SELECT,
          field: TPL_FIELD_SELECT,
          operator: TPL_OPERATORS_SELECT,
          value: TPL_VALUE_INPUT,
          rightBracket: TPL_RIGHT_BRACKET_SELECT
        });
        tr = $(tr);
        self.updateFields(cfg.fields, tr);
        tbody.append(tr);
      });

      // 删除行
      tag.on('click', 'tr>td>.remove', function(){
        var tr = $(this).parent().parent();
        tr.remove();
      });

      return this;
    },

    //
    updateFields: function(fields, range){
      var self = this, 
        tag = this.target, 
        cfg = this.config;
      var optionList = ['<option value="">请选择</option>'];

      cfg.fields = fields;

      $.each(fields, function(i,n){
        optionList.push('<option value="' + n + '">' + n + '</option>');
      });
      optionList = optionList.join('');

      // 如果没有指定更新范围， 就更新所有的下拉框
      if(!range){
        range = tag.find('tbody');
      };

      $('select[name=field]', range).each(function(){
        var select = $(this);
        var val = select.val();
        select.html(optionList);
        select.val(val);
      });
    },

    // 获取条件字符串
    getValue: function(){
      var self = this, 
        tag = this.target, 
        cfg = this.config;
      
      var s = [];

      tag.find('tbody tr').each(function(){
        var tr = $(this);
        var val = self.getTrValue(tr);
        //
        if(val.name && val.operator){
          s.push(val);
        };
      });

      return s;
    },

    getTrValue: function(tr){
      var s = {};
      var value = $.trim(tr.find('input[name=value]').val());

      s = {
        name: tr.find('select[name=field]').val(),
        operator: tr.find('select[name=operator]').val(),
        value: value
      };

      return s;
    }

  };

  Widget = WidgetBase.create(proto);

  return Widget;

});