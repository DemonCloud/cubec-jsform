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
// jsform.setData(name,value)
// jsform.validate(name)
// jsform.destory()
// jsform.emit()
// jsform.reset()

// 事件函数
// jsform.onSubmit(fn)
// jsform.onInValid(fn)
// jsform.beforeSync(fn)
// jsform.onSyncSuccess(fn)
// jsform.onSyncError(fn)
// jsform.onUpdate(fn)
// jsform.onReset(fn)
// jsform.onDestory(fn)

// 静态属性
// jsform.name
// jsform.root

// var myjsform = new JsForm(root, formconfig);

const formconfig = {
  // 表单ID [必须]
  id: "jsform",

  // 表单名称 [必须]
  name: "jsform-example",

  // 表单提交的地址
  url: "/postformdata.do",

  // 提交数据格式
  emulateJSON: true,

  // 持久化
  store: true,

  // 请求方法
  method: "GET",

  // 表单钩子
  events: {
    // 初始化时立马触发
    onCreate(){

    },

    // 在提交前，可以处理数据格式
    beforeSync(data){
      let abc = data;
      return abc;
    },

    // submit之前会触发一次校验函数，当校验不通过时，立即触发钩子
    onInValid(){

    },

    // 调用 jsForm.submit() 后立马触发
    onSubmit(data){

    },

    // 如果定义了URL，则这个事件会发生在提交数据之后服务器返回响应
    onSyncSuccess(data, res){

    },

    onSyncError(data, res){

    },

    // 每当表单有数据发生更新时
    onUpdate(){

    },

    // 当表单生命周期结束，被销毁时
    onDestory(data){

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

      relative: ["data-checkbox"],

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

  render(errmsg){
    // errmsg
    // this.root 挂在的dom节点
    // this.setValue() 设置数值
    // this.triggerSubmit() 主动提交
    // this.triggerReset() 主动提交
    // this.getFormData() 获取当前form的所有数据
    // this.name 获取当前控件的名称
    // this.config 获取当前控件的配置
    // this.className 获取当前控件的className
    // this.value 当前控件的值
    // this.required 是否为必须
  },

  // 可选函数
  events: {
    invalid(){
      
    },

    destory(){

    },

    onSubmit(){

    },

    onDestory(){
    }
  }
};


export {
  formconfig,
  plugin
};
