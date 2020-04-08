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
  _isArray,
  _isBool,
  _isDefine,
  _isFn,
  _isArrayLike,
  _eachArray,
  _v8,
  _size,
  _define,
  _eachObject,
  _fireEvent,
  _merge,
  _extend,
  _eq
} = cubec.struct;

// define JsForm
class JsForm {

  constructor(root, config={}){
    // checker config
    if(!_isDOM(root))
      throw new Error("[JSFORM] 'root' param is not dom element");
    if(!_isObject(config) || !initConfigChecker(config, JsFormPlugins))
      throw new Error("[JSFORM] config param is invalid");
    // checker config end
    config = _v8(_merge(defaultJsFormOptions, config));

    // create jsForm view root element
    const coreRoot = document.createElement("jsform");
    coreRoot.setAttribute("id", config.id);
    coreRoot.setAttribute("name", config.name);
    if(config.className) coreRoot.className = config.className;
    // create Event system
    const events = createEvents(config, this);
    // create JsForm Core
    const core = {
      root: root,
      coreRoot,
      pluginRoots: {},
      pluginExpose: [],
      config: config
    };
    // exist Custom render
    const existCustomRender = !!(config.render && _isString(config.render));

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
      _existCustomRender: {
        value: existCustomRender,
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
      events: {
        // initialize formData
        init(){
          // if model has stored
          const defaultData = this.get();

          // 收集初始化值 [defaultData]
          _eachArray(config.plugins, function(plugin){
            // 1. plugin exist define defaultValue
            //      - storeData not exist data
            //      - storeData exist data but plugin disabled [use store]
            if(plugin.defaultValue != null &&
              (defaultData[plugin.name] == null || plugin.store === false))
              defaultData[plugin.name] = plugin.defaultValue;
            // 2. plugin not use store
            else if(defaultData[plugin.name] != null && plugin.store === false)
              delete defaultData[plugin.name];
          });

          // fresh defaultData static
          this.set(defaultData, true);
        },

        change(data){
          events.emit(EVENTS.UPDATE, data);
        },
      }
    });

    // create formView
    core.formView = cubec.view({
      name: config.name,
      jsform: this,
      root: coreRoot,
      render: existCustomRender ? config.render : "",
      events: {
        completeRender(defaultData){
          // console.log(defaultData);
          // auto use root with renderView ref
          // if not exist customRoot with refs elements
          if(_size(this.refs)){
            // add root for each plugin
            config.plugins = config.plugins.map((plugin)=>{
              if(!plugin.root && this.refs[plugin.name])
                plugin.root = this.refs[plugin.name];
              return plugin;
            });
          }

          // create scope
          createCore(
            this.jsform,
            core.formData,
            JsFormPlugins
          );

          // create init event
          createBindInit(
            this.jsform,
            JsFormPlugins
          );

          // mount jsForm to Root (rendered)
          root.appendChild(coreRoot);

          // trigger [create] event
          events.emit(EVENTS.CREATE, defaultData);
        }
      }
    });

    // async render
    core.formView.render(core.formData.get());
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
    const errfield = [];

    if(vname){
      const scope = core.scope[vname];

      if(!scope) return (checker = false);

      const errmsg = createValidate(core.validate[vname], formData[vname], formData, scope.required);

      if(errmsg !== true && _isString(errmsg)){
        checker = false;
        errfield.push({
          name: vname,
          value: formData[vname],
          root: scope.root,
          plugin: this.getPlugin(vname),
          errmsg
        });
      }

      scope.__render(errmsg);
    }else{
      _eachObject(core.validate, function(validation, name){
        const scope = core.scope[name];
        const errmsg = createValidate(validation, formData[name], formData, scope.required);

        if(errmsg !== true && _isString(errmsg)){
          checker = false;
          errfield.push({
            name: name,
            value: formData[name],
            root: scope.root,
            plugin: this.getPlugin(name),
            errmsg
          });
        }

        scope.__render(errmsg);
      }, this);
    }

    if(!checker) events.emit(EVENTS.INVALID, [errfield]);

    return checker;
  }

  scrollTo(name, options={}){
    const core = this._core(_idt);
    const events = this._events(_idt);
    const findRoot = core.pluginRoots[name];

    if(findRoot){
      findRoot.scrollIntoView(
        _extend(
          {behavior: "smooth", block: "center", inline: "nearest"},
          (options != null && _isObject(options)) ? options : {}
        )
      );

      setTimeout(()=>events.emit(`scrollTo:${name}`), 300);
    }

    return this;
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

    // console.log(events);

    events.emit(EVENTS.RESET, _extend({}, core.defaultData));

    return this;
  }

  clearStore(){
    const core = this._core(_idt);
    core.formData.clearStore();

    return this;
  }

  syncStore(){
    const core = this._core(_idt);
    core.formData.syncStore();

    return this;
  }

  updatePlugin(name, options={}){
    const core = this._core(_idt);
    const events = this._events(_idt);
    const pluginScope = core.scope[name];

    if(pluginScope){
      let updateFlag = false;
      let valueChanged = false;
      const value = options.value;
      const copyConfig = (options.config != null && _isObject(options.config)) ?
        _extend({}, options.config) : pluginScope.config;

      // config change
      if(!_eq(pluginScope.config, copyConfig)){
        updateFlag = true;
        pluginScope.config = copyConfig;
      }

      if(_isBool(options.required)){
        updateFlag = true;
        pluginScope.required = options.required;

        if(!core.validate[name] && pluginScope.required)
          core.validate[name] = pluginScope.required;
      }

      if(options.validate != null &&
        (_isArray(options.validate) ||
         _isFn(options.validate) ||
         _isDefine(options.validate, "RegExp"))
      ){
        updateFlag = true;
        core.validate[name] = options.validate;
      }else if(options.validate === false){
        if(delete core.validate[name])
         updateFlag = true;
      }

      // value change
      if(value != null && !_eq(pluginScope.value, value)){
        valueChanged = true;
        core.formData.set(name, (pluginScope.value = value));
      }

      if(updateFlag){
        if(!valueChanged) core.formData.emit(`change:${name}`, [pluginScope.value]);
        events.emit(`update:${name}`, [copyConfig]);
      }

    }
  }

  getPlugin(name){
    let plugin = null;
    const core = this._core(_idt);
    const pluginScope = core.scope[name];

    if(pluginScope)
      plugin = _extend({}, pluginScope.self, ["init", "events"]);

    return plugin ? Object.freeze(plugin) : plugin;
  }

  submit(actions){
    const core = this._core(_idt);
    const events = this._events(_idt);

    if(this.validate()){
      let formData = core.formData.get();

      formData = _fireEvent(events,"beforeSubmit",[formData]);

      events.emit(EVENTS.SUBMIT, formData);

      if(_isFn(actions)) return actions(formData);
    }
  }

  destroy(){
    const core = this._core(_idt);
    const events = this._events(_idt);

    _eachObject(core.scope, function(scope){
      if(scope.__destory && _isFn(scope.__destory))
        scope.__destory();
    });

    _eachObject(core, function(prop){ delete core[prop]; });

    events.emit(EVENTS.DESTROY, core.formData.get());
    events.off();

    this._root.innerHTML = "";
  }

  beforeSubmit(fn){
    const events = this._events(_idt);
    events.on(EVENTS.BEFORESUBMIT, fn);
    return this;
  }
}

// registerEvents
_eachArray([
  "onSubmit",
  "onInValid",
  "onUpdate",
  "onReset",
  "onDestroy"
], function(name){
  _define(JsForm.prototype, name, {
    value: function(fn){
      const events = this._events(_idt);
      events.on(EVENTS[(name.slice(2)).toUpperCase()],fn.bind(this));
      return this;
    },
    writable: false,
    enumerable: false,
    configurable: false
  });
});

JsForm.getPluginList = ()=> JsFormPlugins.getPluginList();
JsForm.registerPlugin = plugin => JsFormPlugins.registerPlugin(plugin);
JsForm.collect = (use, connect=false) => cubec.atom({ use: _isString(use) ? [use] : (_isArrayLike(use) ? use : []), connect });
JsForm.verison = "0.0.22";
JsForm.author = "YiJun";

export default JsForm;

