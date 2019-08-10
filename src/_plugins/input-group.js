import cubec from 'cubec';
import struct from 'ax-struct-js';
import JsForm from 'JSFORM/jsform';

const each = struct.each();

// config:
//   label
//   inputs
//     name
//     type
//     placeholder

const InputGroup = cubec.view.extend({
  template: `
    <div class="form-item-group {{#errmsg ? "invalid" : ""}}">
      <label class="input-groups-label" for="{{#name}}" ref="label">
        <span>{{#config.label}}</span>
        {{ if isReuqired }}
        <i class="icon ion-ios-medical form-item-required"></i>
        {{/if}}
      </label>
      <div class="input-groups">
        {{*each [input] in config.inputs }}
        <div class="input-group-part">
          <label class="input-group-part-label" for="{{#input.name}}">{{#input.label}}</label>
          <input 
           name="{{#input.name}}"
           type="{{#input.type || "text"}}"
           value="{{#data[input.name]}}"
          />
        </div>
       {{*/each}}
      </div>
    </div>
  `
});


JsForm.registerPlugin({
  type: "input-group",

  description: "input group 组件",

  init(){
    const scope = this;

    scope._model = cubec.model({
      data: scope.value || {},
      events: {
        change(){
          scope.setValue(this.get());
        }
      }
    });

    // 生成inputgroup组件
    scope._view = InputGroup({
      root: scope.root
    });

   each(scope.config.inputs, function(input){
     scope._view.on(`input:input[name='${input.name}']`, function(e){
       scope._model.set(input.name, e.currentTarget.value);
     });
   });
  },

  render(errmsg){
    const scope = this;

    scope._view.render({
      name: scope.name,
      isReuqired: scope.required,
      errmsg: errmsg,
      config: scope.config,
      data: scope._model.get()
    });
  },

  events: {
    // invalid: function(value, formData, errmsg){
    //   console.log("input", this.name, value);
    // }
  }
});
