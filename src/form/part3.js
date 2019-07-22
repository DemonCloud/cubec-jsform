import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

const part3View = cubec.view({
  name: "aucan-form-A-part3",

  template: `
    <div class="form-part">
      <div className="form-part_title">护照信息</div>
      <div className="form-part_description"></div>
      <div className="form-part_items" ref='form'></div>
    </div>
  `,

  events: {
    completeRender(){
      if(!this.refs.form.init){
        this.refs.form.init = true;

        this.jsform = new JsForm(this.refs.form, {
          id: "form-part-3",
          name: "A_form_part3",
          events: {
            onSubmit(data){
              console.log(data);
            }
          },
          plugins: [
            {
              type: "input",
              name: "passport_start_date",
              className: "form-part-itemwrap passport_start_date",
              config: {
                label: "护照签发日期",
                type: "date",
              }
            },

            {
              type: "input",
              name: "passport_end_date",
              className: "form-part-itemwrap passport_end_date",
              config: {
                label: "护照到期日期",
                type: "date"
              }
            },

            {
              type: "input",
              name: "passport_address",
              className: "form-part-itemwrap passport_address",
              config: {
                label: "护照签发地",
                placeholder: "请填写护照签发地"
              }
            },

            {
              type: "textarea",
              name: "passport_lose_process",
              className: "form-part-itemwrap passport_lose_process",
              config: {
                label: "是否有丢失过护照?",
                placeholder: "如果是，请填写详细原因"
              }
            },

            {
              type: "textarea",
              name: "passport_visit_country",
              className: "form-part-itemwrap passport_visit_country",
              config: {
                label: "过去五年是否有去过其他国家?",
                placeholder: "如果是，请提供地点以及时间"
              }
            },

          ]
        });
      }
    }
  }

});

export default part3View;
