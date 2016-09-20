/* Grid数据表格控件 by liuhaiping 

用法：

//
require(['grid'], function(Grid){

  // 第一个参数：一个<table></table>元素或者它的选择器
  // 第二个参数：配置参数
  var grid = new Grid('#tb', {

    // AJAX获取远程数据的地址；也可以用data属性来显示本地数据，见下文；
    url: 'data/grid.js',

    // AJAX方法，仅在定义了url时有效
    method: 'POST',

    // AJAX参数，仅在定义了url时有效
    params: {
      page: 1,
      pageSize: 9999,
    },

    // 在定义了url的情况下，data可以是一个函数，用于处理AJAX返回的数据
    // 在没有定义url的情况下，data可以是直接是一个对象数组；
    // 对象数据的格式应该为：[{},{},{},...]
    data: function(json){
      return json.data;
    },

    // 列信息
    // key是必填的
    columns: [
      { key: 'id', label: 'id' },
      { key: 'name', label: '姓名' },
      { key: 'email', label: '邮箱' },
      { key: 'action', label: '操作', 

        // formatter可以在单元格中显示自定义的内容
        // 第一个参数row为当前行的data对象
        // 第二个参数col为当前列的配置信息
        formatter: function(row, col){
          return '<a href="delUser(' + row.id + '):;">删除</a>';
        } 
      }
    ]
  });

});

*/

define(['jquery', 'mustache', 'widget', 'ajax', 'css!grid.css'], 
  function($, Mustache, WidgetBase, Ajax){

  var Widget;

  var TPL_THEAD_TRS =
    '<tr>' +
    '{{#columns}}' +
    '<th width="{{width}}">{{label}}</th>' +
    '{{/columns}}' +
    '</tr>';

  var TPL_TBODY_TRS = 
    '{{#rows}}' +
    '<tr>' +
    '{{#cols}}' +
    '<td class="{{cls}}" cell-id="{{cellId}}">' + 
    '  <div class="grid-td-value">{{&value}}</div>' + 
    '</td>' +
    '{{/cols}}' +
    '</tr>' +
    '{{/rows}}';

  var TPL_PAGER_TR = 
    '<tr>' + 
    '<th colspan="{{colspan}}"></th>' + 
    '</tr>';

  var TPL_PAGER = 
    '<div>' +
    '  {{#hasPrev}}' +
    '  <a href="javascript:;" class="btn-prev">上一页</a>' +
    '  {{/hasPrev}}' +
    '  {{#hasNext}}' +
    '  <a href="javascript:;" class="btn-next">下一页</a>' +
    '  {{/hasNext}}' +
    '  &nbsp;&nbsp;当前{{page}}/{{pageCount}}页' +
    '</div>';

  var EDITABLE_TD_CLS = 'grid-editable-td';

  var proto = {

    // 默认配置
    defaults: {
      pagination: false,
      params: {}
    },

    // 初始化
    init: function(){

      var self = this;
      var tag = this.target, cfg = this.config;
      var thead;

      // add class
      tag.addClass('grid');
      tag.html('<thead></thead><tfoot style="display:none"></tfoot><tbody></tbody>');

      // thead
      thead = Mustache.render(TPL_THEAD_TRS, cfg);
      tag.find('thead').html(thead);

      if(cfg.autoLoad !== false){
        this.refresh();
      };

      // 点击单元格变成可编辑
      tag.on('click', 'td.' + EDITABLE_TD_CLS, function(){
        var editorWrap = $('.grid-td-editor', this);
        var editor;
        var cellId = this.getAttribute('cell-id');
        var cell = self._cells[cellId];
        
        if(!cell || !cell.col.editor) return;

        $('.grid-td-value', this).hide();
        //
        if(editorWrap.length === 0){
          editorWrap = $('<div class="grid-td-editor"></div>').appendTo(this);
          editor = cell.col.editor.call(self, cell.data, cell.col);
          editor = $(editor);
          editorWrap.html(editor);
        }else{
          editor = editorWrap.children();
        };

        editor.val(cell.value);

        editorWrap.show();
        editor.get(0).focus();
      });

      // 失去焦点，应用修改
      tag.on('blur', '.grid-td-editor>select, .grid-td-editor>input', function(){
        var editorWrap = $(this).parent();
        var td = editorWrap.parent();
        var value = $(this).val();
        var cellId = td.attr('cell-id');
        var cell = self._cells[cellId];
        cell.value = value;
        editorWrap.hide();
        td.find('.grid-td-value').html(value).show();
      });

      tag.on('click', '.btn-next', function(){
        cfg.params.page += 1;
        self.refresh();
      });

      tag.on('click', '.btn-prev', function(){
        cfg.params.page -= 1;
        self.refresh();
      });

      return this;
    },

    // 刷新数据，从URL或本地
    refresh: function(params){
      var self = this, cfg = this.config;

      $.extend(cfg.params, params, {page: cfg.params.page});

      // 加载本地或者远程数据
      Ajax.loadJSON(cfg, function(data, json){
        json = json || {};
        self.loadData(data, {
          total: json.total || 0
        });
      });
    },

    // 加载数据
    loadData: function(data, opts){

      opts = $({}, opts);

      var tag = this.target, cfg = this.config;
      var tbody;
      var rows = [], row, cols, value;
      var cells = this._cells = this._cells || {};
      var pageData = [];
      var dataSize = opts.total || data.length;
      var maxPage = Math.ceil(dataSize / cfg.params.pageSize);
      //
      cfg.params.page = Math.max(cfg.params.page, 1);
      cfg.params.page = Math.min(cfg.params.page, maxPage);

      //
      pageData = data;
      //
      if(cfg.pagination){
        if(!cfg.url && (dataSize > cfg.params.pageSize)){
          pageData = data.slice((cfg.params.page-1) * cfg.params.pageSize, cfg.params.page*cfg.params.pageSize);
        };
      };

      //
      $.each(pageData, function(dataIndex, dataRow){
        //
        row = {};
        cols = row.cols = [];
        $.each(cfg.columns, function(colIndex, col){
          var x = {
            col: col,
            value: (col.formatter || Widget.formatter)(dataRow, col),
            data: dataRow,
            cellId: parseInt(Math.random()*100000000),
            cls: col.editor ? EDITABLE_TD_CLS : '' 
          };
          cols.push(x);
          cells[x.cellId] = x;
        });
        rows.push(row);
      });
      //
      tbody = Mustache.render(TPL_TBODY_TRS, { rows: rows });
      tag.find('tbody').html(tbody);
      // 
      tag = cfg = tbody = rows = row = cols = value = null;
      //
      this.loadDataPager(data, opts);
    },

    loadDataPager: function(data, opts){

      var self = this;
      var tag = this.target, cfg = this.config;
      var tfoot, dataSize, pageCount;

      opts = opts || {};

      tfoot = this.tfoot;

      dataSize = opts.total || data.length;

      pageCount = Math.ceil(dataSize / cfg.params.pageSize);
      
      // 检查是否已创建tfoot
      if(!tfoot){
        tfoot = Mustache.render(TPL_PAGER_TR, {
          colspan: cfg.columns.length
        });
        tfoot = $(tfoot);
        tag.find('tfoot').html(tfoot);
        this.tfoot = tfoot;
      };

      // 显示/隐藏分页
      if(!cfg.pagination || (dataSize <= cfg.params.pageSize)){
        tag.find('tfoot').hide();
        return;
      }else{
        tag.find('tfoot').show();
      };

      tfoot.find('th').html(Mustache.render(TPL_PAGER, {
        hasPrev: cfg.params.page > 1,
        hasNext: cfg.params.page < pageCount,
        page: cfg.params.page,
        pageCount: pageCount
      }));
    }

  };

  Widget = WidgetBase.create(proto);

  // 默认的单元格格式化器
  Widget.formatter = function(row, col){
    var val = row[col.key];
    if(typeof val === 'undefined' || val === null){
      val = '';
    };
    return val;
  };

  return Widget;

});