import cubec from 'cubec';
import struct from 'ax-struct-js';
import JsForm from 'JSFORM/jsform';

const _ajax = struct.ajax();

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

        window.p1 = this.jsform = new JsForm(this.refs.form, {
          id: "form-part-1",

          name: "A_form_part1",

          store: true,

          events: {
            onSubmit(data){
              console.log(data);

              _ajax({
                type: "POST",

                url: "/api/form/submit",

                param: {
                  name: data.name,
                  email: data.email,
                  phone: data.phone,
                  formType: 1,
                  userId: 1,
                  formContent: JSON.stringify(data)
                },

                header: {
                  "Content-Type": "application/json"
                },

                success(res){
                  console.log(res);
                }

              });
            }
          },

          plugins: [
            {
              type: "react-input",
              name: "name",
              className: "form-part-itemwrap name",
              // defaultValue: "ABC",
              required: true,
              config: {
                label: "姓名",
                placeholder: "请填写姓名",
              }
            },

            {
              type: "react-input",
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
              type: "react-input",
              name: "phone",
              className: "form-part-itemwrap phone",
              validate: [/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/, "电话格式不正确"],
              required: true,
              config: {
                abc: 123,
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
