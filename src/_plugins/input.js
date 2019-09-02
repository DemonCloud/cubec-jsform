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
  `,
});

export default JsForm.registerPlugin({
  type: "input",

  description: "input 组件",

  init(){
    const scope = this;

    // 生成input组件
    scope._view = Input({
      root: scope.root,
      events: {
        [`${scope.config.type === "date" ? 'change' : 'input'}:.form-plugin-${scope.name}`] : function(e){
          scope.setValue(e.currentTarget.value);
        },
        "click:label": function(e){
          scope.self.focus();
        }
      }
    });
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

  focus(){
    this._view.refs.input.focus();
  },

  // events: {
  //   scrollTo(){
  //     console.log(this);
  //   }
  // }
});
