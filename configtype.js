// 构造函数
// new JsForm(root, config);
// JsForm.cubec
// JsForm.version
// JsForm.registerPlugin(plugin)
// JsForm.getPluginList()

// 生成实例 jsform
// 主动方法
// jsform.submit()
// jsform.getData(name)
// jsform.getPlugin(name)
// jsform.updatePlugin(name, { config, value })
// jsform.setData(name,value)
// jsform.clearStore()
// jsform.syncStore()
// jsform.scrollTo()
// jsform.validate(name)
// jsform.destroy()
// jsform.reset()

// 事件函数
// jsform.onSubmit(fn)
// jsform.onInValid(fn)
// jsform.beforeSubmit(fn)
// jsform.onUpdate(fn)
// jsform.onReset(fn)
// jsform.onDestroy(fn)

// 静态属性
// jsform.name
// jsform.root

// var myjsform = new JsForm(root, formconfig);

const formconfig = {
  // 表单ID [必须]
  id: "jsform",

  // 表单名称 [必须]
  name: "jsform-example",

  // 持久化
  store: true,

  // 是否滚动加载渲染
  expose: true,

  // 表单钩子
  events: {
    // 初始化结束时立马触发
    onCreate(defaultData){

    },

    // 在提交前，可以处理数据格式
    beforeSubmit(data){
      let abc = data;
      return abc;
    },

    // submit之前会触发一次校验函数，当校验不通过时，立即触发钩子
    onInValid(){

    },

    // 调用 jsForm.submit() 后立马触发
    onSubmit(data){

    },

    // 每当表单有数据发生更新时
    onUpdate(){

    },

    // 当表单生命周期结束，被销毁时
    onDestroy(data){

    }
  },

  //表单组件
  plugins: [
    {
      type: "jsform-input",

      name: "data_input",

      className: "abc",

      defaultValue: 123,

      required: true,

      expose: true,

      exposeMinHeight: 300,

      store: false, // 继承store

      dynamic: "name",

      // dynamic: ["name", function(value, jsFormData){ }],

      // dynamic: function(jsFormData){

      // },

      validate: /abc/i,

      // validate: [/abc/i, "邮箱格式错误"],

      // validate: function(currentValue, formData){
      //   return "当前格式错误";
      // },

      // plugin 插件配置 config
      config: {

        enterSumit: true,

        relativeName: ""
      }
    },
  ]

};


// 编写plugin
// jsform.plugin 方法
//
// jsform.plugin.type 插件名称, 全局唯一, 冲突报错
// jsform.plugin.description 插件描述, 告知插件的作用
// jsform.plugin.init() 插件渲染时初始化执行的函数, 只执行一次
// jsform.plugin.render() 渲染方法, 每当值发生改变时都会触发render函数进行渲染
// jsform.plugin.events() 插件事件钩子
//    - events.update(newConfig) 当插件配置重新更新时触发
//    - events.invalid() 当插件被validate校验值时捕获错误
//    - events.destroy() 当插件即将被销毁时
//    - 其他事件集成jsForm主体
const plugin = {
  type: "jsfrom-input",

  description: "插件描述",

  init(){
    // 初始化插件
    // 创建时调用一次


    // 返回false值或者null值时会阻止首次调用渲染
    // undefined 和 void 0 默认还是渲染(相当于不做处理)
    return false;
  },

  render(errmsg){
    // errmsg
    // this.root 挂在的dom节点
    // this.setValue(value, isStatic) 设置数值
    // this.triggerSubmit() 主动提交
    // this.triggerReset() 主动重置表单
    // this.getFormData() 获取当前form的所有数据
    // this.getFormPlugin(name) 获取当前form的其他组件(plugin之间的通信)
    // this.forceRender(errmsg) 重新渲染当前组件
    // this.name 获取当前控件的名称
    // this.config 获取当前控件的配置
    // this.className 获取当前控件的className
    // this.value 当前控件的值
    // this.required 是否为必须(可写值, 但不建议修改)

    return 0; // 返回销毁函数
  },

  // 可选函数
  events: {
    // 组件被更新时
    update(newConfig){

    },

    // 组件校验不通过时
    invalid(){

    },

    // 组件被销毁时
    destroy(){

    },

    // 表单事件的钩子
    onSubmit(){

    },

    onDestroy(){

    }
  }
};


export {
  formconfig,
  plugin
};
