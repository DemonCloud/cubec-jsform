import cubec from 'cubec';
import initConfigChecker from './checker/initConfig';

import createCore from './create/core';
import createValidate from './create/validate';
import createBindInit from './create/bindinit';
import createEvents from './create/events';

import defaultJsFormOptions from './define/defaultOptions';
import JsFormPlugins from './define/jsformplugins';
import EVENTS from './define/eventNamespace';

const {
  _idt,
  _isDOM,
  _isObject,
  _isString,
  _isFn,
  _isArrayLike,
  _v8,
  _define,
  _eachObject,
  _fireEvent,
  _merge,
  _map,
  _extend,
  _eq
} = cubec.struct;

const requestModel = cubec.model.extend({
  parse: function(e){ return {}; }
});

class JsForm {
  constructor(root, config={}){
    // checker config
    if(!_isDOM(root))
      throw new Error("[JSFORM] 'root' param is not dom element");
    if(!_isObject(config) || !initConfigChecker(config, JsFormPlugins))
      throw new Error("[JSFORM] config param is invalid");

    // checker config end
    config = _v8(_merge(defaultJsFormOptions, config));

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
    _define(this, {
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
        value: idt => (idt === _idt ? core : {}),
        writable: false,
        enumerable: false,
        configurable: false,
      },
      _events: {
        value: idt => (idt === _idt ? events : {}),
        writable: false,
        enumerable: false,
        configurable: false,
      },
    });

    // create formData model
    core.formData = cubec.model({
      name: config.name,
      jsform: this,
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
    const core = this._core(_idt);
    return core.formData.get(name);
  }

  setData(){
    const core = this._core(_idt);

    core.formData.set.apply(core.formData, arguments);
    return this;
  }

  // trigger validate
  validate(vname){
    let checker = true;
    const core = this._core(_idt);
    const events = this._events(_idt);
    const formData = core.formData.get();

    if(vname){
      const scope = core.scope[vname];

      if(!scope) return (checker = false);

      const errmsg = createValidate(core.validate[vname], formData[vname], formData, scope.required);

      if(errmsg !== true && _isString(errmsg)){
        checker = false;
        scope.__destory = scope.self.render.call(scope, errmsg);
      }else if(errmsg === true){
        scope.__destory = scope.self.render.call(scope);
      }
    }else{
      _eachObject(core.validate, function(validation, name){
        const scope = core.scope[name];
        const errmsg = createValidate(validation, formData[name], formData, scope.required);

        if(errmsg !== true && _isString(errmsg)){
          checker = false;
          scope.__destory = scope.self.render.call(scope, errmsg);
        }else if(errmsg === true){
          scope.__destory = scope.self.render.call(scope);
        }
      });
    }

    if(!checker) events.emit(EVENTS.INVALID, formData);

    return checker;
  }

  // reset form data
  reset(){
    const core = this._core(_idt);
    const events = this._events(_idt);

    // reset form Data
    core.formData.set(_extend({}, core.defaultData), true);
    // reset scope value
    _eachObject(core.scope, (scope, name)=>
      scope.value = core.defaultData[name]);

    // triggerRender
    core.triggerRender();

    events.emit(EVENTS.RESET, _extend({},core.defaultData));

    return this;
  }

  clearStore(){
    const core = this._core(_idt);
    core.formData.clearStore();

    return this;
  }

  emit(){
    const events = this._events(_idt);
    events.emit.apply(events, arguments);

    return this;
  }

  updatePlugin(name, options={}){
    const core = this._core(_idt);
    const events = this._events(_idt);
    const pluginScope = core.scope[name];

    if(pluginScope){
      let updateFlag = false;
      const value = options.value;
      const copyConfig = (options.config != null && _isObject(options.config)) ?
        _extend({}, options.config) : pluginScope.config;

      if(!_eq(pluginScope.config, copyConfig)){
        updateFlag = true;
        pluginScope.config = copyConfig;
      }

      if(value != null && !_eq(pluginScope.value, value)){
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
    const core = this._core(_idt);
    const pluginScope = core.scope[name];

    if(pluginScope){
      plugin = _extend({}, pluginScope.self, ["init", "events"]);
      plugin = _map(plugin, function(prop){
        if(_isFn(prop))
          return prop.bind(pluginScope);
        return prop;
      });
    }

    return plugin;
  }

  submit(){
    const core = this._core(_idt);
    const events = this._events(_idt);

    if(this.validate()){
      let formData = core.formData.get();

      if(core.config.url){
        try {
          formData = _fireEvent(events,"beforeSync",[formData]);
          JSON.parse(JSON.stringify(formData));
        }catch (e){
          throw new Error("[JSFORM] [beforeSync] function convert data parseJSON error");
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
    const core = this._core(_idt);
    const events = this._events(_idt);

    _eachObject(core.scope, function(scope){
      if(scope.__destory && _isFn(scope.__destory))
        scope.__destory();
    });

    events.emit(EVENTS.DESTROY, core.formData.get());
    events.off();

    this._root.innerHTML = "";
  }

  // event hooks
  onSubmit(fn){
    const events = this._events(_idt);
    events.on(EVENTS.SUBMIT, fn);
    return this;
  }

  onInValid(fn){
    const events = this._events(_idt);
    events.on(EVENTS.INVALID, fn);
    return this;
  }

  onSyncSuccess(fn){
    const events = this._events(_idt);
    events.on(EVENTS.SYNCSUCCESS, fn);
    return this;
  }

  onSyncError(fn){
    const events = this._events(_idt);
    events.on(EVENTS.SYNCERROR, fn);
    return this;
  }

  onUpdate(fn){
    const events = this._events(_idt);
    events.on(EVENTS.UPDATE, fn);
    return this;
  }

  onReset(fn){
    const events = this._events(_idt);
    events.on(EVENTS.RESET, fn);
    return this;
  }

  onDestroy(fn){
    const events = this._events(_idt);
    events.on(EVENTS.DESTROY, fn);
    return this;
  }

  beforeSync(fn){
    const events = this._events(_idt);
    events.on(EVENTS.BEFORESYNC, fn);
    return this;
  }
}

JsForm.getPluginList = ()=> JsFormPlugins.getPluginList();
JsForm.registerPlugin = plugin => JsFormPlugins.registerPlugin(plugin);
JsForm.collect = (use, connect=false) => cubec.atom({ use: _isString(use) ? [use] : (_isArrayLike(use) ? use : []), connect });

JsForm.verison = "0.0.4";

export default JsForm;
