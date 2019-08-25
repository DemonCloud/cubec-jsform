import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

const part5View = cubec.view({
  name: "aucan-form-A-part5",

  template: `
    <div class="form-part">
      <div class="form-part_title">家庭信息表</div>
      <div class="form-part_description"></div>
      <div class="form-part_items" ref='form'></div>
    </div>
  `,

  events: {
    completeRender(){
      if(!this.refs.form.init){
        this.refs.form.init = true;

        this.jsform = new JsForm(this.refs.form, {
          id: "form-part-5",
          name: "A_form_part5",
          store: true,
          plugins: [
            {
              type: "input-group",
              name: "family_member_father",
              className: "form-part-itemwrap family_member_father",
              config: {
                label: "父亲",
                inputs: [
                  {
                    name: "family_member_name",
                    label: "姓名",
                  },
                  {
                    name: "family_member_brithday",
                    type: "date",
                    label: "出生日期",
                  },
                  {
                    name: "family_member_relation",
                    label: "是否在美国",
                  },
                ]
              }
            },

            {
              type: "input-group",
              name: "family_member_mother",
              className: "form-part-itemwrap family_member_mother",
              config: {
                label: "母亲",
                inputs: [
                  {
                    name: "family_member_name",
                    label: "姓名",
                  },
                  {
                    name: "family_member_brithday",
                    type: "date",
                    label: "出生日期",
                  },
                  {
                    name: "family_member_relation",
                    label: "是否在美国",
                  },
                ]
              }
            },

            {
              type: "input-group",
              name: "family_member_relative",
              className: "form-part-itemwrap family_member_relative",
              config: {
                label: "在美亲戚",
                inputs: [
                  {
                    name: "family_member_name",
                    label: "姓名",
                  },
                  {
                    name: "family_member_relation",
                    label: "出生地",
                  },
                  {
                    name: "family_member_address",
                    label: "居住地",
                  },
                  {
                    name: "family_member_brithday",
                    type: "date",
                    label: "出生日期",
                  },
                ]
              }
            },

            {
              type: "input-group",
              name: "family_member_relative_spouse",
              className: "form-part-itemwrap family_member_relative_spouse",
              config: {
                label: "在美亲戚配偶",
                inputs: [
                  {
                    name: "family_member_name",
                    label: "姓名",
                  },
                  {
                    name: "family_member_relation",
                    label: "出生地",
                  },
                  {
                    name: "family_member_address",
                    label: "居住地",
                  },
                  {
                    name: "family_member_brithday",
                    type: "date",
                    label: "出生日期",
                  },
                ]
              }
            },
          ]
        });
      }
    }
  }

});

export default part5View;
