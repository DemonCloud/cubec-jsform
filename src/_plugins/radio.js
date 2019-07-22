import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

// config:
//   label
//   options

const Radio = cubec.view.extend({
  template: `
    <div class="form-item-group {{#errmsg ? "invalid" : ""}}">
      <label for="{{#name}}">
        <span>{{#config.label}}</span>
        {{ if isReuqired }}
        <i class="icon ion-ios-medical form-item-required"></i>
        {{/if}}
      </label>
      <div class="form-item-radio-group" style="margin-top: -1px">
      {{*each [radio] in config.options}}
      <label class="form-item-radio">
        <span>{{#radio.text}}</span>
        <input 
          ref="input"
          class="form-item-radio-input form-plugin-{{#name}}"
          name="{{#name}}"
          type="radio"
          value="{{#radio.value}}"
          {{# radio.value === value ? "checked" : ""}}
          />
      </label>
      {{*/each}}
      </div>
    </div>
  `
});

JsForm.registerPlugin({
  type: "radio",

  description: "radio 组件",

  init(){
    const scope = this;

    // 生成input组件
    scope._view = Radio({
      root: scope.root,
      events: {
        "change:input": function(e){
          scope.setValue(e.currentTarget.value);
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

  events: {
    // invalid: function(value, formData, errmsg){
    //   console.log("input", this.name, value);
    // }
  }
});
