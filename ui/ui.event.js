define(function(){

  var Event = function(){};

  Event.prototype ={

    on: function(type, fn, context){
      var events;
      //
      if(typeof fn === 'string'){
        fn = context[fn];
      };
      //
      if(typeof fn !== 'function'){
        return;
      };
      //
      events = this._getEvents(type);
      //
      events.push({
        fn: fn,
        context: context || this
      });

      return this;
    },

    off: function(type, fn, context){
      this._setEvents('off', type, fn, context);

      return this;
    },

    fire: function(type, data){
      this._setEvents('fire', type, data);

      return this;
    },

    _getEvents: function(type){
      var events;
      //
      events = this._events = this._events || {};
      //
      return (events[type] = events[type] || []);
    },

    _setEvents: function(act, type, arg, context){
      var events = this._getEvents(type),
        event,
        len = events.length,
        i;

      for(var i = 0; i < len; i++){
        event = events[i];
        if(act === 'fire'){
          event.fn.call(event.context, arg);
        }else if(act === 'off'){
          if(event.fn ===  arg && event.context === context){
            events.splice(i, 1);
          };
        };
      };
    }

  };

  return Event;
});