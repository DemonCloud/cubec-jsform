import cubec from 'cubec';
import EVENTS from '../define/eventNamespace';

const struct = cubec.struct;
const each = struct.each();
const extend = struct.extend();

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

const createEvents = function(config){
  const Events = cubec.model({
    name: `EVENT_MODEL_${config.name}`,
    source: extend({}, config.events),
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

  each(config.events, (fn, event)=>Events.on(event, fn));

  delete config.events;

  return Events;
};

export default createEvents;
