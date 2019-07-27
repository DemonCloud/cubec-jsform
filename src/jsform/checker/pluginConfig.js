const checkPluginConfig = function(plugin){
  let checker = true;

  if(!plugin){
    checker = false;
    console.error("[JSFORM] [plugin register error] invalid plugin option " + plugin);
  }

  if(!plugin.type){
    checker = false;
    console.error("[JSFORM] [plugin register error] plugin must define 'type' property");
  }

  if(!plugin.description){
    checker = false;
    console.error("[JSFORM] [plugin register error] plugin must define 'description' informaction for pluginList");
  }

  if(!plugin.render){
    checker = false;
    console.error("[JSFORM] [plugin register error] plugin must define 'render' function");
  }

  return checker;
};

export default checkPluginConfig;
