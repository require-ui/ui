//
define(['ui.event', 'ui.klass'], function(Event, Klass){

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

    // 初始化参数
    parseConfig: function(cfg){
      //
      this.config = $.extend({}, this.defaults, cfg);
    },

    // 初始化DOM
    parseTarget: function(tag){
      //
      this.target = $(tag);
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