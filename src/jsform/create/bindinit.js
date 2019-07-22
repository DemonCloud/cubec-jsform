import cubec from "cubec";
import createValidate from './validate';

const struct = cubec.struct;
const isString = struct.type("string");
const each = struct.each();
const identify = struct.broken;

const createBindJsFormInit = function(jsform, JsFormPlugins){
  const core = jsform._core(identify);
  const events = jsform._events(identify);
  const config = core.config;

  each(config.plugins, function(plugin){
    const scope = core.scope[plugin.name];
    const getPlugin = JsFormPlugins.plugins[plugin.type];

    if(config.store)
      scope.value = core.formData.get(plugin.name);

    core.formData.on(`change:${plugin.name}`, function(value){
      scope.value = value;

      if(core.validate[plugin.name]){
        const formData = this.get();
        const errmsg = createValidate(core.validate[plugin.name], value, formData, scope.required);
        scope.self.render.call(scope, isString(errmsg) ? errmsg : void 0);
        if(errmsg && isString(errmsg)) events.emit(`invalid:${plugin.name}`, [value,formData,errmsg]);
      }else{
        scope.self.render.call(scope);
      }
    });

    getPlugin.init.call(scope);
    getPlugin.render.call(scope);

    if(!scope.customRoot) core.root.appendChild(scope.root);
  });

  return core.root;
};

export default createBindJsFormInit;
