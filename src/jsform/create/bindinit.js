import cubec from 'cubec';
import createValidate from './validate';
import throttle from '../utils/throttle';

const {
  _idt,
  _isFn,
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

    if(config.store)
      scope.value = core.formData.get(plugin.name);

    // 绑定赋值事件
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
      let initRender = true;

      if(scope.self.init && _isFn(scope.self.init)){
        const needInitRender = scope.self.init.call(scope);

        const preventInitRender = ((needInitRender === false) || (needInitRender === null));

        initRender = !preventInitRender;
      }

      _define(scope, "__init", {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      if(initRender)
        scope.__render();
      // remove scope minHeight;
      if(scope.exposeMinHeight)
        scope.root.style.minHeight = "";
    };

    if((config.expose && plugin.expose !== false) || plugin.expose){
      // if(plugin.expose){ console.log(plugin); }
      scope.__isExpose = false;
      core.pluginExpose.push({
        name: plugin.name,
        root: scope.root,
        createInit: scopeInit
      });
    }else{
      scopeInit();
    }

    // 没有自定义根节点, 则jsForm自动帮助创建节点
    if(!scope.customRoot) core.coreRoot.appendChild(scope.root);
  });

  // expose method
  if(core.pluginExpose.length){
    const handlerExpose = throttle(function(e){
      // remove evnet when empty
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

};

export default createBindJsFormInit;
