import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

const part4View = cubec.view({
  name: "aucan-form-A-part4",

  template: `
    <div class="form-part">
      <div className="form-part_title">签证信息</div>
      <div className="form-part_description"></div>
      <div className="form-part_items" ref='form'></div>
    </div>
  `,

  events: {
    completeRender(){
      if(!this.refs.form.init){
        this.refs.form.init = true;

        this.jsform = new JsForm(this.refs.form, {
          id: "form-part-4",
          name: "A_form_part4",
          events: {
            onSubmit(data){
              console.log(data);
            }
          },
          plugins: [
            {
              type: "input",
              name: "visa_target",
              className: "form-part-itemwrap visa_target",
              config: {
                label: "赴美目的",
                type: "text",
                placeholder: "请填写赴美目的"
              }
            },

            {
              type: "input",
              name: "visa_bearer",
              className: "form-part-itemwrap visa_bearer",
              config: {
                label: "赴美费用承担方",
                type: "text",
                placeholder: "请填写赴美费用承担方"
              }
            },

            {
              type: "input",
              name: "visa_number",
              className: "form-part-itemwrap visa_number",
              config: {
                label: "美签号码",
                type: "text",
                placeholder: "如有，请填写"
              }
            },

            {
              type: "input-group",
              name: "visa_member",
              className: "form-part-itemwrap visa_member",
              config: {
                label: "同行人员",
                inputs: [
                  {
                    name: "visa_member_name",
                    label: "姓名",
                  },
                  {
                    name: "visa_member_brithday",
                    type: "date",
                    label: "出生日期",
                  },
                  {
                    name: "visa_member_relation",
                    label: "关系",
                  },
                ]
              }
            },

            {
              type: "textarea",
              name: "visa_validate_date",
              className: "form-part-itemwrap visa_validate_date",
              config: {
                label: "上次获得美国签证有效日期及有效期时间",
                placeholder: "如果过去 有获得过美国签证，请如实填写"
              }
            },

            {
              type: "textarea",
              name: "visa_validate_address",
              className: "form-part-itemwrap visa_validate_address",
              config: {
                label: "上次申请美国签证的国家及地区",
                placeholder: "如果过去 有获得过美国签证，请如实填写"
              }
            },

            {
              type: "textarea",
              name: "visa_wait_date",
              className: "form-part-itemwrap visa_wait_date",
              config: {
                label: "过去5次到达美国时间 及 离境时间",
                placeholder: "如果过去 有获得过美国签证，请如实填写"
              }
            },

            {
              type: "textarea",
              name: "visa_driving_license",
              className: "form-part-itemwrap visa_driving_license",
              config: {
                label: "是否有美国驾照",
                placeholder: "如果有，请填写驾照号码"
              }
            },

            {
              type: "textarea",
              name: "visa_apply_bygone",
              className: "form-part-itemwrap visa_apply_bygone",
              config: {
                label: "是否申请过美国入籍和移民申请",
                placeholder: "如果有，请说明原因及时间"
              }
            },

            {
              type: "textarea",
              name: "visa_reject_reason",
              className: "form-part-itemwrap visa_reject_reason",
              config: {
                label: "是否又被美国领事馆拒签或者被美国海关拒绝入境",
                placeholder: "如果有，请说明原因及时间"
              }
            },

            {
              type: "textarea",
              name: "visa_connect_by",
              className: "form-part-itemwrap visa_connect_by",
              config: {
                label: "在美国联系人名或者机构以及关系",
                placeholder: "如果有，请提供其姓名或机构名称，地址，以及双方关系"
              }
            },

          ]
        });
      }
    }
  }

});

export default part4View;
