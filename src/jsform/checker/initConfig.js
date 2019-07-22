import cubec from 'cubec';

const struct = cubec.struct;
const isString = struct.type("string");
const isArray = struct.type("array");
const each = struct.each();

const initConfigChecker = function(config, JsFormPlugins){
  let checker = true;
  config = config || {};

  if(!config.id || !isString(config.id)){
    checker = false;
    console.error("[JSFORM] [config error] {id} must be defined string");
  }

  if(!config.name || !isString(config.name)){
    checker = false;
    console.error("[JSFORM] [config error] {name} must be defined string");
  }

  if(!config.plugins || !isArray(config.plugins)){
    checker = false;
    console.error("[JSFORM] [config error] {plugins} must be defined and contains at least one plug-in");
  }

  if(config.plugins){
    each(config.plugins, function(plugin){
      if(!plugin){
        checker = false;
        return console.error("[JSFORM] [config error] {plugins} plugins config include invalid undefined pluginOption");
      }

      if(!plugin.name){
        checker = false;
        return console.error("[JSFORM] [config error] {plugins} ["+plugin.type+"] type plugin must define 'name' property");
      }

      if(!JsFormPlugins.plugins[plugin.type]){
        checker = false;
        console.error("[JSFORM] [config error] {plugins} '"+plugin.type+"' is not register in JSForm");
      }
    });
  }

  return checker;
};

export default initConfigChecker;
