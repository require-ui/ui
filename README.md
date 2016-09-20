# ui

这是一个基于requirejs和jquery的UI库，包含数据表格、弹出层、下拉框等常用控件。

目前还在开发中，功能比较简单，变化比较大，暂时不建议使用。

## 基本用法：

第一步，把ui目录复制到项目中。

第二步，引入脚本。
``` html

<input type="button" value="新增" id="btnAdd">

<form action="#" id="loginForm" style="display: none">
  <label for="">用户名</label>
  <input type="text">
  <label for="">邮箱</label>
  <input type="text">
  <button>保存</button>
</form>

<script src="../ui/lib/require/require.js"></script>
<script src="../ui/config/config.js"></script>
```

第四步，通过require引入要使用的模块，然后初始化。
```html
<script>
  require(['jquery', 'layout'], function($, Layout){
    // 初始化控件
    new Layout('#loginForm', {
      trigger: '#btnAdd',
      width: 500,
      height: 200,
      autoClose: false
    });
  });
</script>
```

以下是目前包含的控件的参数说明：

## grid 

数据表格控件。

支持加载本地和远程数据，支持自定义单元格内容。

暂时不支持分页。

```js
//
require('grid', function(Grid){

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
```

## select

下拉框控件。

支持加载本地和远程数据。

```js
require('select', function(Select){

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
```

## layout

弹出层控件。

支持模态窗口。

```js
//
require('layout', function(Layout){

  // 第一个参数：作为弹窗内容的元素或选择器
  // 第二个参数：配置参数，可选
  var layout = new Layout('#loginForm', {
    
    // 触发弹窗显示的元素
    trigger: '#btnShowLoginForm',
    
    // 尺寸，默认为自动
    width: 500,
    height: 400,
    
    // 是否显示为模态框
    modal: true,

    // 是否点击模态框时自动隐藏
    autoClose: true
  });

});
```
