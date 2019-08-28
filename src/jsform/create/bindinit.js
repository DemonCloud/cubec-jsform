import cubec from 'cubec';
import createValidate from './validate';
import throttle from '../utils/throttle';

const {
  _idt,
  _define,
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
        scope.__render(errmsg);
        if(errmsg) events.emit(`invalid:${plugin.name}`, [value,formData,errmsg]);
      }else{
        scope.__render();
      }
    });

    const scopeInit = function(){
      getPlugin.init.call(scope);
      _define(scope, "__init", {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
      scope.__render();
    };

    if((config.expose && plugin.expose !== false) || plugin.expose){
      scope.__isExpose = false;
      core.pluginExpose.push({
        name: plugin.name,
        root: scope.root,
        createInit: scopeInit
      });
    }else{
      scopeInit();
    }

    if(!scope.customRoot) core.root.appendChild(scope.root);
  });

  // expose method
  if(core.pluginExpose.length){
    const handlerExpose = throttle(function(e){
      if(!core.pluginExpose.length){
        removeEventListener("resize", handlerExpose, false);
        removeEventListener("scroll", handlerExpose, false);
        return;
      }

      const nextPluginExpose = [];
      _eachArray(core.pluginExpose, function(plugin){
        const rect = plugin.root.getBoundingClientRect();

        if(rect.top < (window.innerHeight - 90) && rect.bottom > 80){
          plugin.createInit();
        }else
          nextPluginExpose.push(plugin);
      });
      core.pluginExpose = nextPluginExpose;
    }, 120);

    addEventListener("resize", handlerExpose, false);
    addEventListener("scroll", handlerExpose, false);
    dispatchEvent(new Event("resize"));
  }

  return core.root;
};

export default createBindJsFormInit;
