import cubec from 'cubec';
import struct from 'ax-struct-js';
import initConfigChecker from './checker/initConfig';

import createCore from './create/core';
import createValidate from './create/validate';
import createBindInit from './create/bindinit';
import createEvents from './create/events';

import defaultJsFormOptions from './define/defaultOptions';
import JsFormPlugins from './define/jsformplugins';
import EVENTS from './define/eventNamespace';

const identify = struct.broken;
const isDom = struct.type("dom");
const isObject = struct.type("object");
const isString = struct.type("string");
const isFunction = struct.type("func");
const isArrayLike = struct.type('arraylike');
const v8 = struct.v8();
const defined = struct.define();
const each = struct.each();
const merge = struct.merge();
const map = struct.map();
const extend = struct.extend();
const eq = struct.eq();

const requestModel = cubec.model.extend({});

class JsForm {
  constructor(root, config={}){
    // checker config
    if(!isDom(root))
      throw new Error("[JSFORM] 'root' param is not dom element");
    if(!isObject(config) || !initConfigChecker(config, JsFormPlugins))
      throw new Error("[JSFORM] config param is invalid");

    // checker config end
    config = v8(merge(defaultJsFormOptions, config));

    // create jsForm root element
    const coreRoot = document.createElement("jsform");
    coreRoot.setAttribute("id", config.id);
    coreRoot.setAttribute("name", config.name);
    coreRoot.setAttribute("namespace", Math.random().toString().replace(".",""));

    if(config.className)
      coreRoot.className = config.className;

    // create Event system
    const events = createEvents(config);
    // create core scope
    const core = {
      root: coreRoot,
      config: Object.freeze(config)
    };

    // create core & events getter
    defined(this, {
      name: {
        value: config.name,
        writable: false,
        enumerable: false,
        configurable: false,
      },
      _root: {
        value: root,
        writable: false,
        enumerable: false,
        configurable: false,
      },
      _core: {
        value: idt => (idt === identify ? core : {}),
        writable: false,
        enumerable: false,
        configurable: false,
      },
      _events: {
        value: idt => (idt === identify ? events : {}),
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    // create formData model
    core.formData = cubec.model({
      name: config.name,
      store: !!config.store,
      data: createCore(this, JsFormPlugins),
      events: {
        change: data => events.emit(EVENTS.UPDATE, data),
      }
    });

    // mount jsForm
    root.appendChild(createBindInit(this, JsFormPlugins));

    // trigger create event
    events.emit(EVENTS.CREATE, core.formData.get());
  }

  // getFormData
  getData(name){
    const core = this._core(identify);
    return core.formData.get(name);
  }

  setData(){
    const core = this._core(identify);

    core.formData.set.apply(core.formData, arguments);
    return this;
  }

  // trigger validate
  validate(vname){
    let checker = true;
    const core = this._core(identify);
    const events = this._events(identify);
    const formData = core.formData.get();

    if(vname){
      const scope = core.scope[vname];

      if(!scope) return (checker = false);

      const errmsg = createValidate(core.validate[vname], formData[vname], formData, scope.required);

      if(errmsg !== true && isString(errmsg)){
        checker = false;
        scope.self.render.call(scope, errmsg);
      }else if(errmsg === true){
        scope.self.render.call(scope);
      }
    }else{
      each(core.validate, function(validation, name){
        const scope = core.scope[name];
        const errmsg = createValidate(validation, formData[name], formData, scope.required);

        if(errmsg !== true && isString(errmsg)){
          checker = false;
          scope.self.render.call(scope, errmsg);
        }else if(errmsg === true){
          scope.self.render.call(scope);
        }
      });
    }

    if(!checker) events.emit(EVENTS.INVALID, formData);

    return checker;
  }

  // reset form data
  reset(){
    const core = this._core(identify);
    const events = this._events(identify);

    // reset form Data
    core.formData.set(extend({}, core.defaultData), true);
    // reset scope value
    each(core.scope, (scope, name)=>
      scope.value = core.defaultData[name]);

    // triggerRender
    core.triggerRender();

    events.emit(EVENTS.RESET, extend({},core.defaultData));

    return this;
  }

  clearStore(){
    const core = this._core(identify);
    core.formData.clearStore();

    return this;
  }

  emit(){
    const events = this._events(identify);
    events.emit.apply(events, arguments);

    return this;
  }

  updatePlugin(name, options={}){
    const core = this._core(identify);
    const events = this._events(identify);
    const pluginScope = core.scope[name];

    if(pluginScope){
      let updateFlag = false;
      const value = options.value;
      const copyConfig = (options.config != null && isObject(options.config)) ?
        extend({}, options.config) : pluginScope.config;

      if(!eq(pluginScope.config, copyConfig)){
        updateFlag = true;
        pluginScope.config = copyConfig;
      }

      if(value != null && !eq(pluginScope.value, value)){
        updateFlag = false;
        core.formData.set(name, pluginScope.value = value);
      }

      if(updateFlag){
        core.formData.emit(`change:${name}`, [value]);
        events.emit(`update:${name}`, [copyConfig]);
      }

    }
  }

  getPlugin(name){
    let plugin = null;
    const core = this._core(identify);
    const pluginScope = core.scope[name];

    if(pluginScope){
      plugin = extend({}, pluginScope.self, ["init", "events"]);
      plugin = map(plugin, function(prop){
        if(isFunction(prop))
          return prop.bind(pluginScope);
        return prop;
      });
    }

    return plugin;
  }

  submit(){
    const core = this._core(identify);
    const events = this._events(identify);

    if(this.validate()){
      let formData = core.formData.get();

      if(core.config.url){
        try {
          formData = events.source.beforeSync(formData);
          JSON.parse(JSON.stringify(formData));
        }catch (e){
          throw new Error("[JSFORM] [beforeSync] function convert data parse error");
        }

        const config = core.config;
        // create request
        const request = requestModel({
          url: config.url,
          data: formData,
          emulateJSON: config.emulateJSON,
          events: events.createEmitter(formData)
        });

        if(config.method === "GET"){
          request.fetch(formData, config.header);
        }else{
          request.sync(config.header);
        }
      }

      events.emit(EVENTS.SUBMIT, formData);
    }

    return this;
  }

  destroy(){
    const core = this._core(identify);
    const events = this._events(identify);

    events.emit(EVENTS.DESTROY, core.formData.get());
    events.off();

    this._root.innerHTML = "";
  }

  // event hooks
  onSubmit(fn){
    const events = this._events(identify);
    events.on(EVENTS.SUBMIT, fn);
    return this;
  }

  onInValid(fn){
    const events = this._events(identify);
    events.on(EVENTS.INVALID, fn);
    return this;
  }

  onSyncSuccess(fn){
    const events = this._events(identify);
    events.on(EVENTS.SYNCSUCCESS, fn);
    return this;
  }

  onSyncError(fn){
    const events = this._events(identify);
    events.on(EVENTS.SYNCERROR, fn);
    return this;
  }

  onUpdate(fn){
    const events = this._events(identify);
    events.on(EVENTS.UPDATE, fn);
    return this;
  }

  onReset(fn){
    const events = this._events(identify);
    events.on(EVENTS.RESET, fn);
    return this;
  }

  onDestroy(fn){
    const events = this._events(identify);
    events.on(EVENTS.DESTROY, fn);
    return this;
  }

  beforeSync(fn){
    if(isFunction(fn)){
      const events = this._events(identify);
      events.source.beforeSync = fn;
    }

    return this;
  }
}

JsForm.getPluginList = ()=> JsFormPlugins.getPluginList();
JsForm.registerPlugin = plugin => JsFormPlugins.registerPlugin(plugin);
JsForm.collect = (use, connect=false) => cubec.atom({ use: isString(use) ? [use] : (isArrayLike(use) ? use : []), connect });

JsForm.verison = "0.0.2";

export default JsForm;
