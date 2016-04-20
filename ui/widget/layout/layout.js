/* Layout弹窗控件 by liuhaiping 

用法：

//
require(['layout'], function(Layout){

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

*/
define(['jquery', 'mustache', 'widget', 'css!layout.css'], 
  function($, Mustache, WidgetBase){
 
  // 待实现功能：
  // 防止一个target被重复初始化
  // 模态
  // 自动关闭（完成）
  // 居中(完成)
  // 关闭按钮（完成）

  var TPL_MODAL =
    '<div class="layout-modal"></div>';

  var TPL_LAYOUT =
    '<div class="layout-widget">' +
    
    // 关闭按钮
    '  {{#topCloseButton}}' +
    '   <div class="layout-close">x</div>' +
    '  {{/topCloseButton}}' +

    // 标题
    '  {{#title}}'+
    '   <div class="layout-title">' +
    '    {{title}}' +
    '   </div>' +
    '  {{/title}}'+

    // 内容
    '  <div class="layout-container"></div>' +

    // 按钮组
    '  {{#hasButtons}}'+
    '   <div class="layout-buttons">' +
    '    {{#buttons}}' +
    '      <button type="button" class="{{cls}}" id="{{id}}">{{text}}</button>' +
    '    {{/buttons}}' +
    '   </div>' +
    '  {{/hasButtons}}'+

    '</div>';

  var Widget;

  var proto = {

    // 默认配置
    defaults: {
      // 自动关闭
      autoClose: false,
      // 模态显示
      modal: true,
      //
      onClose: function(){},
      //
      closeButtonText: '关闭',
      //
      on: {
        'click .layout-close-button': 'onClickCloseButton'
      }
    },

    init:  function(){

      var self = this,
        tag = this.target, 
        cfg = this.config;

      // 默认隐藏
      tag.hide();
      
      // 占位符
      // this.placeholder = $('<span style="display:none"></span>')
      //   .insertAfter(tag);

      // 触发显示/隐藏
      if(cfg.toggle){
        //
        $(cfg.toggle).click(function(){
          if(self.isOpen){
            self.hide();
          }else{
            self.show();
          }
        });
      };

      // 触发显示
      if(cfg.trigger){
        //
        $(cfg.trigger).click(function(){
          if(!self.isOpen){
            self.show();
          }
        });
      };

      if(cfg.width) tag.width(cfg.width);
      if(cfg.height) tag.height(cfg.height);

      return this;
    },

    // 取得模态DIV（没有则创建）
    getModal: function(){
      
      var modal, cur;

      if(!Widget._modal){
        //
        modal = $(TPL_MODAL).hide().appendTo('body');
        Widget._modal = modal;
        // 自动关闭
        modal.on('click', function(){
          cur = Widget.current;
          if(cur && cur.config.autoClose){
            cur.hide();
          };
        });
        // 自动调整模态层尺寸
        $(window).resize(function(){
          var docEl;
          cur = Widget.current;
          if(!cur || !cur.isOpen) return;
          //
          docEl = document.documentElement;
          modal.css({
            width: docEl.clientWidth + 'px',
            height: docEl.clientHeight + 'px'
          });
        });
      };

      return Widget._modal;
    },

    // 取得DIV（没有则创建）
    getWidget: function(){
      
      var self = this, 
        cfg = this.config, 
        tag = this.target,
        html,
        layout, buttons, container;


      if(!self._layout){

        buttons = [];

        // 内置关闭按钮
        if(cfg.closeButton !== false){
          buttons.push({
            isCloseButton: true,
            text: cfg.closeButtonText,
            cls: 'layout-close-button',
            // fn: function(){
            //   if(cfg.onClose.call(self) !== false){
            //     self.hide();
            //   };
            // }
          });
        };

        // 给按钮绑定事件
        $.each(buttons, function(index, btn){
          btn.id = 'btn' + Math.floor(Math.random()*10000000);
          //
          if($.isFunction(btn.fn)){
            $('body').on('click', '#' + btn.id, function(){
              btn.fn.call(self);
            });
          };
        });

        // 生成HTML
        html = Mustache.render(TPL_LAYOUT, {
          buttons: buttons,
          hasButtons: !!buttons.length,
          topCloseButton: false,
          title: cfg.title || ''
        });

        // 创建元素
        layout = $(html).hide().appendTo('body');
        container = layout.find('.layout-container');
        self._layout = layout;
        // 关闭按钮
        layout.on('click', '.layout-close', function(){
          if(cfg.onClose.call(self) !== false){
            self.hide();
          };
        });

        // 把layout清空， 把target移入
        container.html('');
        tag.appendTo(container);
      };

      return self._layout;
    },

    onClickCloseButton: function(){

      var self = this, 
        cfg = this.config;

      if(cfg.onClose.call(self) !== false){
        self.hide();
      };
    },

    show: function(){

      var tag = this.target, 
        cfg = this.config,
        layout = this.getWidget(),
        modal = this.getModal();

      // 计算位置，居中
      var left, top,
        clientWidth = document.documentElement.clientWidth,
        clientHeight = document.documentElement.clientHeight;

      // 关闭当前打开的
      if(Widget.current && Widget.current.isOpen){
        Widget.current.hide();
      };

      // 设置当前
      Widget.current = this;

      // 显示模态层
      if(cfg.modal){
        modal.css({
          width: clientWidth + 'px',
          height: clientHeight + 'px'
        }).show();
      };

      // 显示窗口
      tag.show();
      layout.show();

      // 计算居中位置
      left = (clientWidth - layout.width()) / 2;
      top = (clientHeight - layout.height()) / 2;

      // 设置位置
      layout.css({
        top: top + 'px',
        left: left + 'px'
      });

      this.fire('show');

      //
      this.isOpen = true;

      this.bindEvents(layout);

      return this;
    },

    hide: function(){

      if(!this.isOpen) return this;

      var tag = this.target, 
        cfg = this.config,
        layout = this.getWidget(),
        modal = this.getModal();

      // 把target移回原处
      //tag.insertAfter(this.placeholder);

      tag.hide();
      layout.hide();
      modal.hide();

      this.fire('hide');

      //
      this.isOpen = false;

      return this;
    }

  };

  Widget = WidgetBase.create(proto);

  return Widget;

});