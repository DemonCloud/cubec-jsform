import cubec from 'cubec';
import createValidate from './validate';

const {
  _idt,
  _eachObject,
}= cubec.struct;

const createBindJsFormInit = function(jsform, JsFormPlugins){
  const core = jsform._core(_idt);
  const events = jsform._events(_idt);
  const config = core.config;

  _eachObject(config.plugins, function(plugin){
    const scope = core.scope[plugin.name];
    const getPlugin = JsFormPlugins.plugins[plugin.type];

    if(config.store)
      scope.value = core.formData.get(plugin.name);

    core.formData.on(`change:${plugin.name}`, function(value){
      scope.value = value;

      if(core.validate[plugin.name]){
        const formData = this.get();
        const errmsg = createValidate(core.validate[plugin.name], value, formData, scope.required);
        scope.__destory = scope.self.render.call(scope, errmsg === true ?  void 0 : errmsg);
        if(errmsg) events.emit(`invalid:${plugin.name}`, [value,formData,errmsg]);
      }else{
        scope.self.render.call(scope);
      }
    });

    getPlugin.init.call(scope);
    scope.__destory = getPlugin.render.call(scope);

    if(!scope.customRoot) core.root.appendChild(scope.root);
  });

  return core.root;
};

export default createBindJsFormInit;
