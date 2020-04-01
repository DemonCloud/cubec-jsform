import cubec from 'cubec';
import createScope from './createscope';

const {
  _eachArray,
  _idt,
  _clone,
  _isString,
  _isFn,
  _isArray,
  _noop
} = cubec.struct;

const toggleDynamicScope = function(scope, plugin, validate, showOhide){
  // show
  if(showOhide){
    scope.root.style = "visibility: visible";
    // 显示时装载验证状态
    scope.required = !!plugin.required;

    if(plugin.required)
      validate[plugin.name] = true;
    if(plugin.validate)
      validate[plugin.name] = plugin.validate;
  // hide
  }else{
    scope.root.style = "position: absolute; top: -9999px; left: -9999px; line-height: 0; width: 0; height: 0; visibility: hidden; opacity: 0; pointer-events: none; overflow: hidden; z-index: -9999; zoom: -1;";
    // 隐藏时移除验证状态
    scope.required = false;

    delete validate[plugin.name];
  }
};

// 创建scope
const createCore = function(jsform, formData, JsFormPlugins){
  const defaultData = formData.get();
  const core = jsform._core(_idt);
  const scope = core.scope = {};
  const validate = core.validate = {};
  const config = core.config;

  // 创建 scope [核心]
  _eachArray(config.plugins, function(plugin){
    // console.log(plugin);
    // 识别插件类型
    const isDynamicPlugin = plugin.dynamic && (
      // 1. 仅监听属性值是否存在
      _isString(plugin.dynamic) ||
      // 2. 监听所有formData值的变化, 动态创建
      _isFn(plugin.dynamic) ||
      // 3. 数组 [prop, listen function], 监听一个属性, 自定义处理
      (_isArray(plugin.dynamic) && plugin.dynamic[0] && _isString(plugin.dynamic[0]) && _isFn(plugin.dynamic[1])));

    // normal plugin
    if(!isDynamicPlugin)
      scope[plugin.name] = createScope(plugin, defaultData, validate, jsform, JsFormPlugins);
    // dynamic plugin
    else{
      // 仅需要判断值是否存在
      const useDynamicProps =
        _isString(plugin.dynamic) ? plugin.dynamic :
        _isArray(plugin.dynamic)  ? plugin.dynamic[0] : void 0;
      const useDynamic =
        _isString(plugin.dynamic) ? function(targetValue){ return targetValue != null && targetValue !== ""; } :
        _isArray(plugin.dynamic) ? plugin.dynamic[1] :
        _isFn(plugin.dynamic) ? plugin.dynamic : _noop;

      // 创建scope
      const dynamicScope = scope[plugin.name] = createScope(plugin, defaultData, validate, jsform, JsFormPlugins, useDynamic, useDynamicProps);

      formData.on(useDynamicProps != null ? `change:${useDynamicProps}` : "change", function(targetValue){
        // 验证渲染
        const needRender = useDynamic(targetValue);

        // 切换根节点的显示状态
        toggleDynamicScope(dynamicScope, plugin, validate, needRender);

        if(needRender)
          dynamicScope.__render();
        // 不符合动态值需求时初始值将被还原
        else {
          dynamicScope.value = void 0;
          formData.set(plugin.name, void 0);
        }
      });
    }

  });

  core.triggerRender = function(){
    _eachArray(config.plugins, function(plugin){
      const scope = core.scope[plugin.name];
      // console.log(scope);
      scope.__destory = scope.__render();
    });

    return core.scope;
  };

  // default reset data
  core.defaultData = _clone(defaultData);

  return _clone(defaultData);
};

export default createCore;
