import cubec from 'cubec';
import EVENTS from '../define/eventNamespace';

const {
  _eachObject,
  _extend
} = cubec.struct;

const emitterSuccessHandler = function(Events, formData){
  return function(res){
    Events.emit(EVENTS.SYNCSUCCESS, formData, res);
  };
};

const emitterErrorHandler = function(Events, formData){
  return function(res){
    Events.emit(EVENTS.SYNCERROR, formData, res);
  };
};

const createEvents = function(config, jsform){
  const Events = cubec.model({
    name: `EVENT_MODEL_${config.name}`,
    source: _extend({}, config.events),
    createEmitter: function(formData){
      const success = emitterSuccessHandler(Events, formData);
      const eerror = emitterErrorHandler(Events, formData);

      return {
        "sync:success": success,
        "fetch:success": success,
        "sync:error": eerror,
        "fetch:error": eerror
      };
    }
  });

  _eachObject(config.events, (fn, event)=>Events.on(event, fn.bind(jsform)));

  delete config.events;

  return Events;
};

export default createEvents;
