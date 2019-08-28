import cubec from 'cubec';
import createScope from './createscope';

const {
  _eachArray,
  _idt,
} = cubec.struct;

const createCore = function(jsform, JsFormPlugins){
  const defaultData = {};
  const core = jsform._core(_idt);
  const scope = core.scope = {};
  const validate = core.validate = {};
  const config = core.config;

  _eachArray(config.plugins, function(plugin){
    let buildScope = createScope(plugin, defaultData, validate, jsform, JsFormPlugins);
    if(buildScope) scope[plugin.name] = buildScope;
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
