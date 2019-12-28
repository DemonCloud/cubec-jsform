import cubec from 'cubec';

const {
  _isObject,
  _isFn,
  _isDOM,
  _isString,
  _isNumber,
  _toString,
  _isPlainObject,
  _eachObject,
  _eachArray,
  _define,
  _has,
  _map,
  _idt,
  _size,
  _extend
} = cubec.struct;

const selfEventsList = [
  "invalid",
  "update",
  "scrollTo",
];

export default function createScope(
  plugin,
  defaultData,
  validate,
  jsform,
  JsFormPlugins
){
  let createscope;
  const core = jsform._core(_idt);
  const events = jsform._events(_idt);

  if(_isPlainObject(plugin) && _size(plugin) > 2){
    createscope = { __init: false };
    let createscope_handler = [];

    // create render function
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

    // create expose root minHeight
    if(createscope.root &&
      ((core.config.expose && plugin.expose!==false) || plugin.expose === true) &&
      (plugin.exposeMinHeight)
    ){
      createscope.root.style.minHeight =
        _isNumber(plugin.exposeMinHeight) ? plugin.exposeMinHeight+"px" : _toString(plugin.exposeMinHeight);
    }

    if(plugin.className)
      createscope.root.className = plugin.className;

    createscope.self = _map(JsFormPlugins.plugins[plugin.type], function(props){
      if(_isFn(props)) props = props.bind(createscope);
      return props;
    });

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
    createscope.getPlugin = function(name){
      if(_isString(name) && plugin.name != name)
        return jsform.getPlugin(name);
      return null;
    };

  }

  return createscope;
}
