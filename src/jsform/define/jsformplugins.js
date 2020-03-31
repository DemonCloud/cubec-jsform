import cubec from 'cubec';
import checkPluginConfig from '../checker/pluginConfig';

const {
  _eachObject,
  _isObject,
  _isString,
  _noop,
  _merge
} = cubec.struct;

const createPlugin = function(type){
  return function(options={}){
    let res;

    if(options &&
      _isObject(options) &&
      _isString(options.name)
    ){
      delete options.type;
      res = _merge(
        { type, required:false, config:{} },
        options
      );
    }else{
      console.error(`[JSFORM] [plugin] ${type} throw handler empty or error options`, options);
    }

    return res;
  };
};

const pluginDefaultOptions = {
  description: "",
  init: _noop,
  events: {}
};

class JsFormPlugins {
  constructor(){
    this.plugins = {};

    // console.log(this.plugins);
  }

  getPluginList(){
    const list = {};

    _eachObject(this.plugins, function(plugin, name){
      list[name] = plugin.description || "";
    });

    return list;
  }

  registerPlugin(plugin){
    if(checkPluginConfig(plugin)){
      // console.log(plugin.type);
      this.plugins[plugin.type] = _merge(pluginDefaultOptions, plugin);
      return createPlugin(plugin.type);
    }

    throw new Error("[JSFORM] registerPlugin handler error of plugin.type");
  }
}

export default new JsFormPlugins();
