define(function(){

  var klass = function(Parent, props){

    var Child, F, name;

    // 构造函数
    Child = function(){
      var uber = Child.uber, proto = Child.prototype;
      // 调用父类构造函数（如果有）
      if(uber && uber.hasOwnProperty('__construct')){
        uber.__construct.apply(this, arguments);
      };
      // 子类构造函数
      if(proto.hasOwnProperty('__construct')){
        uber.__construct.apply(this, arguments);
      };
    };

    // 继承
    Parent = Parent || Object;
    F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.uber = Parent.prototype;
    Child.prototype.constructor = Child;

    // 实现方法
    for(name in props) if(props.hasOwnProperty(name)){
      Child.prototype[name] = props[name];
    };

    return Child;

  };

  return klass;

});