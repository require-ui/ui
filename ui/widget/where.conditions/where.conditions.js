/* Where条件控件 by liuhaiping 

用法：

//
require(['where.conditions'], function(WhereConditions){



});

*/

define(['jquery', 'mustache', 'widget', 'ajax', 'css!where.conditions.css'], 
  function($, Mustache, WidgetBase, Ajax){

  var Widget;

  var TPL_THEAD_TRS =
    '<tr>' +
    '  <td>括号</td>' +
    '  <td>逻辑</td>' +
    '  <td>括号</td>' +
    '  <td>字段</td>' +
    '  <td>比较符</td>' +
    '  <td>值</td>' +
    '  <td>括号</td>' +
    '  <td><a class="add" href="javascript:;">+</a></td>' +
    '</tr>';

  var TPL_TBODY_TRS = 
    '<tr>' +

    '<td class="">{{{leftBracket}}}</td>' +
    '<td class="">{{{logic}}}</td>' +
    '<td class="">{{{midBracket}}}</td>' +
    '<td class="">{{{field}}}</td>' +
    '<td class="">{{{operator}}}</td>' +
    '<td class="">{{{value}}}</td>' +
    '<td class="">{{{rightBracket}}}</td>' +

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
    // '<select name="operator">' +
    // '  <option value="=">=</option>' +
    // '  <option value="&gt;">&gt;</option>' +
    // '  <option value="&lt;">&lt;</option>' +
    // '  <option value="&gt;=">&gt;=</option>' +
    // '  <option value="&lt;=">&lt;=</option>' +
    // '  <option value="like">like</option>' +
    // '</select>';
    '<select name="operator">' +
    '  {{#operators}}' +
    '  <option value="{{.}}">{{.}}</option>' +
    '  {{/operators}}' +
    '</select>';

  var TPL_VALUE_INPUT = 
    '<input type="text" name="value"/>';

  var TPL_LEFT_BRACKET_SELECT = 
    '<select name="leftBracket">' +
    '  <option value="">&nbsp;</option>' +
    '  <option value="(">(</option>' +
    '  <option value="((">((</option>' +
    '  <option value="(((">(((</option>' +
    '  <option value="((((">((((</option>' +
    '  <option value="(((((">(((((</option>' +
    '</select>';

  var TPL_MID_BRACKET_SELECT = 
    '<select name="midBracket">' +
    '  <option value="">&nbsp;</option>' +
    '  <option value="(">(</option>' +
    '  <option value="((">((</option>' +
    '  <option value="(((">(((</option>' +
    '  <option value="((((">((((</option>' +
    '  <option value="(((((">(((((</option>' +
    '</select>';

  var TPL_RIGHT_BRACKET_SELECT = 
    '<select name="rightBracket">' +
    '  <option value="">&nbsp;</option>' +
    '  <option value=")">)</option>' +
    '  <option value="))">))</option>' +
    '  <option value=")))">)))</option>' +
    '  <option value="))))">))))</option>' +
    '  <option value=")))))">)))))</option>' +
    '</select>';

  var proto = {

    // 默认配置
    defaults: {
      // 比较符
      operators: ['=', '>', '<', '>=', '<=', 'like', '!=']
    },

    // 初始化
    init: function(){

      var self = this;
      var tag = this.target, cfg = this.config;
      var thead, tbody;
      var operatorsHtml;

      this.fields = cfg.fields || [];

      // add class
      tag.addClass('where.conditions');
      tag.html('<thead></thead><tbody></tbody>');

      // thead
      thead = tag.find('thead');
      thead.html(Mustache.render(TPL_THEAD_TRS, {}));

      // tbody
      tbody = tag.find('tbody');

      operatorsHtml = Mustache.render(TPL_OPERATORS_SELECT, {
        operators: cfg.operators
      });

      // 添加行
      tag.on('click', '.add', function(){
        var tr = Mustache.render(TPL_TBODY_TRS, {
          leftBracket: TPL_LEFT_BRACKET_SELECT,
          logic: TPL_LOGIC_SELECT,
          midBracket: TPL_MID_BRACKET_SELECT,
          field: TPL_FIELD_SELECT,
          operator: operatorsHtml,
          value: TPL_VALUE_INPUT,
          rightBracket: TPL_RIGHT_BRACKET_SELECT
        });
        tr = $(tr);
        self.updateFields(tr);
        tbody.append(tr);
        self._fireChangeEvent();
      });

      // 删除行
      tag.on('click', 'tr>td>.remove', function(){
        var tr = $(this).parent().parent();
        tr.remove();
        self._fireChangeEvent();
      });

      // fire change event
      tag.on('change', 'input,select', function(){
        self._fireChangeEvent();
      });

      return this;
    },

    _fireChangeEvent: function(){
      this.fire('change', {
        newVal: this.getValue()
      });
    },

    //
    updateFields: function(range){
      var self = this, 
        tag = this.target, 
        cfg = this.config;
      var optionList = ['<option value="">请选择</option>'];

      $.each(cfg.fields, function(i,n){
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
        s.push(self.getTrValue(tr));
      });

      return s.join(' ').replace(/\s+/gm, ' ');
    },

    getTrValue: function(tr){
      var s = [];
      var value = $.trim(tr.find('input[name=value]').val());

      if(!value || isNaN(value)){
        value = '"' + value + '"';
      };

      s.push(
        tr.find('select[name=leftBracket]').val(),
        tr.find('select[name=logic]').val(),
        tr.find('select[name=midBracket]').val(),
        tr.find('select[name=field]').val(),
        tr.find('select[name=operator]').val(),
        value,
        tr.find('select[name=rightBracket]').val()
      );
      return s.join(' ');
    }

  };

  Widget = WidgetBase.create(proto);

  return Widget;

});