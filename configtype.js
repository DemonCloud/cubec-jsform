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
    // 初始化时立马触发
    onCreate(){

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

      validate: /abc/i,

      // validate: [/abc/i, "邮箱格式错误"],

      // validate: function(currentValue, formData){
      //   return "当前格式错误";
      // },

      config: {
        enterSumit: true,
        relativeName: ""
      }
    },
  ]

};


const plugin = {
  type: "jsfrom-input",

  description: "插件描述",

  init(){
    // 初始化插件
    // 创建时调用一次

  },

  render(errmsg){
    // errmsg
    // this.root 挂在的dom节点
    // this.setValue() 设置数值
    // this.triggerSubmit() 主动提交
    // this.triggerReset() 主动重置表单
    // this.getFormData() 获取当前form的所有数据
    // this.forceRender(errmsg) 重新渲染当前组件
    // this.name 获取当前控件的名称
    // this.config 获取当前控件的配置
    // this.className 获取当前控件的className
    // this.value 当前控件的值
    // this.required 是否为必须

    return 0; // 返回销毁函数
  },

  // 可选函数
  events: {
    update(newConfig){

    },

    invalid(){

    },

    destroy(){

    },

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
