import cubec from 'cubec';

const {
  _isObject,
  _isFn,
  _isDOM,
  _eachObject,
  _eachArray,
  _define,
  _has,
  _idt,
  _size,
  _extend
} = cubec.struct;

const selfEventsList = [
  "invalid",
  "update",
  "scrollTo",
];

const createCore = function(jsform, JsFormPlugins){
  const defaultData = {};
  const core = jsform._core(_idt);
  const events = jsform._events(_idt);
  const scope = core.scope = {};
  const validate = core.validate = {};
  const config = core.config;

  _eachArray(config.plugins, function(plugin){
    if(plugin && _isObject(plugin) && _size(plugin) > 2){
      let createscope = scope[plugin.name] = { __init: false };
      let createscope_handler = [];

      createscope.__render = function(errmsg){
        if(this.__init)
          this.__destory = this.self.render.call(this, errmsg === true ?  void 0 : errmsg);
      }.bind(createscope);

      if(plugin.defaultValue)
        defaultData[plugin.name] = plugin.defaultValue;

      createscope.required = !!plugin.required;

      if(plugin.required && delete plugin.required)
        validate[plugin.name] = true;

      if(plugin.validate)
        validate[plugin.name] = plugin.validate;

      _define(createscope, "config", {
        value: (plugin.config!=null && _isObject(plugin.config)) ?
          _extend({},plugin.config) : {},
        writable: true,
        enumerable: false,
        configurable: false,
      });

      delete plugin.config;

      _define(createscope, "customRoot", {
        value: _isDOM(plugin.root),
        writable: false,
        enumerable: false,
        configurable: false,
      });

      _eachObject(plugin, function(value, prop){
        _define(createscope, prop, {
          value,
          writable: false,
          enumerable: false,
          configurable: false,
        });
      });

      _define(createscope, "root", {
        value: _isDOM(plugin.root) ? plugin.root : document.createElement("item"),
        writable: false,
        enumerable: false,
        configurable: false,
      });

      core.pluginRoots[plugin.name] = createscope.root;

      if(plugin.className)
        createscope.root.className = plugin.className;

      createscope.self = JsFormPlugins.plugins[plugin.type];

      _eachObject(createscope.self.events, function(fn, event){
        if(!_has(selfEventsList, event))
          events.on(event, fn.bind(createscope));
      });

      _eachArray(selfEventsList, function(fnName){
        const fn = createscope.self.events[fnName];

        if(_isFn(fn)) events.on(`${fnName}:${plugin.name}`, fn.bind(createscope));
      });

      createscope.value = plugin.defaultValue;
      createscope.setValue = function(value, isStatic){ core.formData.set(plugin.name, value, isStatic); };
      createscope.triggerSubmit = function(){ jsform.submit.apply(jsform, arguments); };
      createscope.triggerReset = function(){ jsform.reset.apply(jsform, arguments); };
      createscope.subscribe = function(name, handler){
        if(name && name !== createscope.name){
          core.formData.on(`change:${name}`, handler);
          createscope_handler.push(handler);
        }
      };
      createscope.unsubscribe = function(name, handler){
        if(name && name !== createscope.name){
          if(_isFn(handler)){
            core.formData.off(`change:${name}`, handler);
          }else if(handler == null){
            let fn = createscope_handler.pop();
            while(fn){
              core.formData.off(`change:${name}`, fn);
              fn = createscope_handler.pop();
            }
          }
        }
      };
      createscope.forceRender = function(errmsg){ createscope.__destory = createscope.self.render.call(createscope, errmsg); };
      createscope.getFormData = function(name){ return jsform.getData.apply(jsform, arguments); };
    }
  });

  core.triggerRender = function(){
    _eachArray(config.plugins, function(plugin){
      const scope = core.scope[plugin.name];
      scope.__destory = JsFormPlugins.plugins[plugin.type].render.call(scope);
    });
    return core.scope;
  };

  core.defaultData = defaultData;

  return defaultData;
};

export default createCore;
