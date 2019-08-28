import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';
import InputPlugin from "../_plugins/input";
import SelectPlugin from '../_plugins/select';

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

          plugins: [
            InputPlugin({
              name: "name",
              className: "form-part-itemwrap name",
              required: true,
              // expose: true,
              config: {
                label: "姓名",
                placeholder: "请填写姓名",
              }
            }),

            InputPlugin({
              name: "prename",
              className: "form-part-itemwrap prevname",
              required: true,
              config: {
                label: "曾用名",
                placeholder: "请填写曾用名",
              }
            }),

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

            InputPlugin({
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
            }),

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

            SelectPlugin({
              name: "userId",
              className: "form-part-itemwrap userId",
              required: true,
              config: {
                label: "中介",
                url: "/api/user",
                dataParse(res){
                  const options = res.content.map((user)=>({
                    text: user.username,
                    value: user.id
                  }));
                  return options;
                }
              }
            }),
          ]
        });

        this.jsform.onInValid(function(errors){
          console.log(this);

          const err = errors[0];
          // const errPlugin = this.getPlugin(err.name);
          this.scrollTo(err.name);
        });

      }
    }
  }

});

export default part1View;
