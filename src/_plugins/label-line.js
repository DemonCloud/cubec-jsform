import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

// config:

const LabelLine = cubec.view.extend({
  template: `
    <div class="form-item-group label-line" style="margin-top: -1px">{{#config.label}}</div>
  `
});

JsForm.registerPlugin({
  type: "label-line",

  description: "label-line 组件",

  init(){
    const scope = this;

    scope._view = LabelLine({
      root: scope.root,
    });
  },

  render(errmsg){
    const scope = this;

    scope._view.render({
      config: scope.config,
    });
  },

  events: {
    // invalid: function(value, formData, errmsg){
    //   console.log("input", this.name, value);
    // }
  }
});
