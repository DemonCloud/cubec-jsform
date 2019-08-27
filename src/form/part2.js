import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

const part2View = cubec.view({
  name: "aucan-form-A-part2",

  template: `
    <div class="form-part">
      <div className="form-part_title">地址信息</div>
      <div className="form-part_description"></div>
      <div className="form-part_items" ref='form'></div>
    </div>
  `,

  events: {
    completeRender(){
      if(!this.refs.form.init){
        this.refs.form.init = true;

        window.p2 = this.jsform = new JsForm(this.refs.form, {
          id: "form-part-2",
          name: "A_form_part2",
          store: true,
          expose: true,
          plugins: [
            {
              type: "input",
              name: "address",
              className: "form-part-itemwrap address",
              required: true,
              config: {
                label: "当前住址",
                placeholder: "请填写当前住址",
              }
            },

            {
              type: "input",
              name: "save_address",
              className: "form-part-itemwrap save_address",
              config: {
                label: "收件地址",
                placeholder: "如不同当前住址，请填写",
              }
            }

          ]
        });
      }
    }
  }

});

export default part2View;
