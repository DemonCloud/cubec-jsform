import JsForm from 'JSFORM/jsform';
import Vue from 'vue/dist/vue.common.dev';

JsForm.registerPlugin({
  type: "vue-input",

  description: "vue-input 组件",

  init(){
    const scope = this;

    console.log(scope.root);

    scope._view = new Vue({
      data: {
        p: {
          value: scope.value,
          name: scope.name,
          config: scope.config,
          isReuqired: !!scope.required,
          errmsg: false
        }
      },

      methods: {
        inputValue(e){
          scope.setValue(e.currentTarget.value);
        }
      },

      template: `
        <div class="form-item-group">
          <label :for="p.name">
            <span>{{ p.config.label }}</span>
            <i v-if="p.isReuqired" class="icon ion-ios-medical form-item-required"></i>
          </label>
          <input 
            class="form-plugin"
              :name="p.name"
              :placeholder="p.config.placeholder"
              :type="p.config.type || 'text'"
              :value="p.value"
              v-on:change="inputValue" />
        </div>
      `
    });

  },

  render(errmsg){
    const scope = this;

    if(scope._view.$mount){
      scope._view.$mount(scope.root);
    }else{
      scope._view.p = {
        value: scope.value,
        name: scope.name,
        config: scope.config,
        isReuqired: !!scope.required,
        errmsg
      };
    }
  },

  events: {
  }
});
