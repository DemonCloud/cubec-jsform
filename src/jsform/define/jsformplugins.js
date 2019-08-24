import cubec from 'cubec';
import struct from 'ax-struct-js';
import checkPluginConfig from '../checker/pluginConfig';

const each = struct.each();
const noop = struct.noop();
const merge = struct.merge();

const pluginDefaultOptions = {
  description: "",
  init: noop,
  events: {}
};

class JsFormPlugins {
  constructor(){
    this.plugins = {};
  }

  getPluginList(){
    const list = {};

    each(this.plugins, function(plugin, name){
      list[name] = plugin.description || "";
    });

    return list;
  }

  registerPlugin(plugin){
    if(checkPluginConfig(plugin)){
      // console.log(plugin.type);
      this.plugins[plugin.type] = merge(pluginDefaultOptions, plugin);
    }
  }

}

export default new JsFormPlugins();
