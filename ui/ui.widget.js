//
define(['ui.event', 'ui.klass', 'jquery'], function(Event, Klass, $){

  var Widget;

  Widget = Klass(Event, {

    // 构造函数
    __construct: function(tag, cfg){

      this.parseTarget(tag);
      
      this.parseConfig(cfg);

      this.parseEvents();

      this.init && this.init();

      // 
      if(this.config.cls){
        this.target.addClass(this.config.cls);
      };

    },

    // 绑定事件
    bindEvents: function(container){

      var self = this;

      // this.on 处理
      var events = this.config.on || {}, event, selector, fn;
      //
      for(var n in events) if(events.hasOwnProperty(n)){

        // 回调事件
        fn = events[n];
        if(typeof fn === 'string'){
          fn = self[fn].bind(self);
        };
        if(typeof fn !== 'function'){
          continue;
        };

        // 分解 "event selector"
        n = n.split(/\s+/);
        if(n.length < 2) continue;

        // event & selector
        event = n[0]+'.bindEvents';
        selector = n[1];

        // 绑定
        $(container || document.body)
          .off(event, selector)
          .on(event, selector, function(e){
            this(e);
          }.bind(fn));
      };

    },

    // 初始化参数
    parseConfig: function(cfg){
      //
      this.config = $.extend(true, {}, this.defaults, cfg);
    },

    // 初始化DOM
    parseTarget: function(tag){
      //
      this.target = $(tag);
      this.container = this.target;
      if(!this.target.length){
        throw 'not found target ' + tag;
      };
    },

    // 初始化事件: cfg.on
    parseEvents: function(){
      var events = this.config.on, name, fn;
      if(!events) return;
      for(name in events) if(events.hasOwnProperty(name)){
        fn = events[name];
        this.on(name, fn, this);
      };
    }

  });

  // 创建子类
  Widget.create = function(protos){

    return Klass(Widget, protos);
  };

  return Widget;

});