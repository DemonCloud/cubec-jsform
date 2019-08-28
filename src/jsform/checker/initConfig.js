import cubec from 'cubec';

const {
  _isString,
  _isArray,
} = cubec.struct;

const initConfigChecker = function(config, JsFormPlugins){
  let checker = true;
  config = config || {};

  if(!config.id || !_isString(config.id)){
    checker = false;
    console.error("[JSFORM] [config error] {id} must be defined string");
  }

  if(!config.name || !_isString(config.name)){
    checker = false;
    console.error("[JSFORM] [config error] {name} must be defined string");
  }

  if(!config.plugins || !_isArray(config.plugins)){
    checker = false;
    console.error("[JSFORM] [config error] {plugins} must be defined and contains at least one plug-in");
  }

  if(_isArray(config.plugins)){
    config.plugins = config.plugins.filter((e)=>e);

    const names = {};
    let i = config.plugins.length;
    let tmp;
    for(; i--; ){
      tmp = config.plugins[i].name;
      if(names[tmp]){
        checker = false;
        console.error(`[JSFORM] [config error] {plugins} exist repetitive name plugin -> {${tmp}}`);
        break;
      }else
        names[tmp] = true;
    }
  }

  return checker;
};

export default initConfigChecker;
