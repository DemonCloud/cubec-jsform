import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

const part1View = cubec.view({
  name: "aucan-form-A-part1",

  template: `
    <div class="form-part">
      <div className="form-part_title">基本信息</div>
      <div className="form-part_description"></div>
      <div className="form-part_items" ref='form'></div>
    </div>
  `,

  events: {
    completeRender(){
      if(!this.refs.form.init){
        this.refs.form.init = true;

        this.jsform = new JsForm(this.refs.form, {
          id: "form-part-1",
          name: "A_form_part1",
          store: true,
          events: {
            onSubmit(data){
              console.log(data);
            }
          },
          plugins: [
            {
              type: "input",
              name: "name",
              className: "form-part-itemwrap name",
              required: true,
              config: {
                label: "姓名",
                placeholder: "请填写姓名",
              }
            },

            {
              type: "input",
              name: "prename",
              className: "form-part-itemwrap prevname",
              required: true,
              config: {
                label: "曾用名",
                placeholder: "请填写曾用名",
              }
            },

            {
              type: "radio",
              name: "sex",
              className: "form-part-itemwrap sex",
              required: true,
              defaultValue: "male",
              config: {
                label: "性别",
                options: [
                  {text: "男", value: "male"},
                  {text: "女", value: "female"},
                ]
              }
            },

            {
              type: "input",
              name: "phone",
              className: "form-part-itemwrap phone",
              required: true,
              config: {
                label: "电话号码",
                type: "phone",
                placeholder: "请填写联系电话",
              }
            },

            {
              type: "input",
              name: "email",
              className: "form-part-itemwrap email",
              required: true,
              validate: [/^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/, "邮箱格式@不正确"],
              config: {
                label: "邮箱地址",
                type: "email",
                placeholder: "请填写邮箱地址",
              }
            },

            {
              type: "input",
              name: "birthday",
              className: "form-part-itemwrap birthday",
              required: true,
              config: {
                label: "出生日期",
                type: "date",
                placeholder: "请填写出生日期",
              }
            },

            {
              type: "input",
              name: "birth_address",
              className: "form-part-itemwrap birth_address",
              config: {
                label: "出生地",
                placeholder: "请填写出生地",
              }
            },

          ]
        });
      }
    }
  }

});

export default part1View;
