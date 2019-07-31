import cubec from 'cubec';

const struct = cubec.struct;
const isObject = struct.type("object");
const isFunction = struct.type("func");
const isDom = struct.type("dom");
const each = struct.each();
const defined = struct.define();
const identify = struct.broken;
const size = struct.size();

const createCore = function(jsform, JsFormPlugins){
  const defaultData = {};
  const core = jsform._core(identify);
  const events = jsform._events(identify);
  const scope = core.scope = {};
  const validate = core.validate = {};
  const config = core.config;

  each(config.plugins, function(plugin){
    if(plugin && isObject(plugin) && size(plugin) > 2){
      let createscope = scope[plugin.name] = {};

      if(plugin.defaultValue)
        defaultData[plugin.name] = plugin.defaultValue;

      if(plugin.required)
        validate[plugin.name] = true;

      if(plugin.validate)
        validate[plugin.name] = plugin.validate;

      defined(createscope, "config", {
        value: (plugin.config!=null && isObject(plugin.config)) ? plugin.config : {},
        writable: true,
        enumerable: false,
        configurable: false,
      });

      delete plugin.config;

      defined(createscope, "customRoot", {
        value: isDom(plugin.root),
        writable: false,
        enumerable: false,
        configurable: false,
      });

      each(plugin, function(value, prop){
        defined(createscope, prop, {
          value,
          writable: false,
          enumerable: false,
          configurable: false,
        });
      });

      defined(createscope, "root", {
        value: isDom(plugin.root) ? plugin.root : document.createElement("item"),
        writable: false,
        enumerable: false,
        configurable: false,
      });


      if(plugin.className)
        createscope.root.className = plugin.className;

      createscope.self = JsFormPlugins.plugins[plugin.type];

      each(createscope.self.events, function(fn, event){
        events.on(event, fn.bind(createscope));
      });

      if(isFunction(createscope.self.events.invalid))
        events.on(`invalid:${plugin.name}`, createscope.self.events.invalid.bind(createscope));

      createscope.value = plugin.defaultValue;
      createscope.setValue = function(value, isStatic){
        core.formData.set(plugin.name, value, isStatic);
      };
      createscope.triggerSubmit = ()=>jsform.submit.apply(jsform, arguments);
      createscope.triggerReset = ()=>jsform.reset.apply(jsform, arguments);
      createscope.getFormData = function(){
        return jsform.getData.apply(jsform, arguments);
      };

    }
  });

  core.triggerRender = function(){
    each(config.plugins, function(plugin){
      JsFormPlugins.plugins[plugin.type].render.call(core.scope[plugin.name]);
    });

    return core.scope;
  };

  core.defaultData = defaultData;

  return defaultData;
};

export default createCore;
