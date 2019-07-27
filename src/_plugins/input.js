import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

// config:
//   label
//   type
//   placeholder
//   enterSubmit

const Input = cubec.view.extend({
  template: `
    <div class="form-item-group {{#errmsg ? "invalid" : ""}}">
      <label for="{{#name}}">
        <span>{{#config.label}}</span>
        {{ if isReuqired }}
        <i class="icon ion-ios-medical form-item-required"></i>
        {{/if}}
      </label>
      <input 
        ref="input"
        class="form-plugin-{{#name}}"
        name="{{#name}}"
        placeholder="{{#config.placeholder}}"
        type="{{#config.type || "text"}}"
        value="{{#value}}" />
    </div>
  `
});

JsForm.registerPlugin({
  type: "input",

  description: "input 组件",

  init(){
    const scope = this;

    // 生成input组件
    scope._view = Input({
      root: scope.root,
      events: {
        [`input:.form-plugin-${scope.name}`] : function(e){
          scope.setValue(e.currentTarget.value);
        },
        "click:label": function(e){
          this.refs.input.focus();
        }
      }
    });

    if(scope.config.enterSubmit === true){
      scope._view.on(`keypress:.form-item-${scope.name}`, function(e){
        if(e.keyCode === 13) scope.triggerSubmit();
      });
    }
  },

  render(errmsg){
    const scope = this;

    scope._view.render({
      value: scope.value,
      name: scope.name,
      config: scope.config,
      isReuqired: scope.required,
      errmsg: errmsg
    });
  },

  events: {
    // invalid: function(value, formData, errmsg){
    //   console.log("input", this.name, value);
    // }
  }
});
