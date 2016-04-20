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
    autoClose: true,

    // 事件绑定
    on: {
        'click .close': function(){
            this.hide();
        },
        'dblclick': 'hide'
    }
  });

});
```
