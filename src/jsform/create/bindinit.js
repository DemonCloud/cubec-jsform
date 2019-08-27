import cubec from 'cubec';
import createValidate from './validate';
import throttle from '../utils/throttle';

const {
  _idt,
  _eachArray,
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

    if(config.expose){
      core.pluginExpose.push({
        name: plugin.name,
        root: scope.root,
        createInit(){
          getPlugin.init.call(scope);
          scope.__destory = getPlugin.render.call(scope);
        }
      });
    }else{
      getPlugin.init.call(scope);
      scope.__destory = getPlugin.render.call(scope);
    }

    if(!scope.customRoot) core.root.appendChild(scope.root);
  });

  // expose method
  if(config.expose){
    const handlerExpose = throttle(function(e){
      if(!core.pluginExpose.length){
        removeEventListener("resize", handlerExpose, false);
        removeEventListener("scroll", handlerExpose, false);
        return;
      }

      const nextPluginExpose = [];
      _eachArray(core.pluginExpose, function(plugin){
        const rect = plugin.root.getBoundingClientRect();

        if(rect.top < (window.innerHeight - 50) && rect.bottom > 40){
          plugin.createInit();
        }else
          nextPluginExpose.push(plugin);
      });
      core.pluginExpose = nextPluginExpose;
    }, 120, {
      'leading': true,
      'trailing': true
    });

    addEventListener("resize", handlerExpose, false);
    addEventListener("scroll", handlerExpose, false);
  }

  return core.root;
};

export default createBindJsFormInit;
