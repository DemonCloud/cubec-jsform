import cubec from 'cubec';
import struct from 'ax-struct-js';
import JsForm from 'JSFORM/jsform';

const ajax = struct.ajax();
const noop = struct.noop();

const Select = cubec.view.extend({
  template: `
    <div class="form-item-group {{#errmsg ? "invalid" : ""}}">
      <label for="{{#name}}">
        <span>{{#config.label}}</span>
        {{ if isReuqired }}
        <i class="icon ion-ios-medical form-item-required"></i>
        {{/if}}
      </label>
      <select 
        ref="select"
        class="form-plugin-{{#name}}"
        name="{{#name}}"
        >
        <option {{#!value ? "selected": ""}} disabled>请选择</option>
        {{*each [option] in options}}
        <option value="{{option.value}}" {{#value===option.value? "selected" : ""}}>{{#option.text}}</option>
        {{*/each}}
      </select>
    </div>
  `
});

export default JsForm.registerPlugin({
  type: "select",

  description: "select 组件",

  init(){
    const scope = this;

    if(scope.config.options)
      scope._options = scope.config.options;

    if(!scope.config.dataParse)
      scope.config.dataParse = noop;

    // 生成input组件
    scope._view = Select({
      root: scope.root,
      events: {
        [`change:.form-plugin-${scope.name}`] : function(e){
          // scope.setValue(e.currentTarget.value);
          if(scope._options){
            const getValue = scope._options[e.currentTarget.selectedIndex-1];
            scope.setValue(getValue.value);
          }
        }
      }
    });

    if(scope.config.url){
      ajax({
        type: "GET",

        url: scope.config.url,

        success(res){
          scope._options = (scope.config.dataParse(res)) || [];
          scope.forceRender();
        }
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
      options: scope._options || [],
      errmsg: errmsg
    });
  },

  events: {
    // invalid: function(value, formData, errmsg){
    //   console.log("input", this.name, value);
    // }
  }
});
