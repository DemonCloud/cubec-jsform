import cubec from 'cubec';
import JsForm from 'JSFORM/jsform';

const part6View = cubec.view({
  name: "aucan-form-A-part6",

  template: `
    <div class="form-part">
      <div class="form-part_title">个人信息</div>
      <div class="form-part_description"></div>
      <div class="form-part_items" ref='form'></div>
    </div>
  `,

  events: {
    completeRender(){
      if(!this.refs.form.init){
        this.refs.form.init = true;

        this.jsform = new JsForm(this.refs.form, {
          id: "form-part-6",
          name: "A_form_part6",
          store: true,
          plugins: [
            {
              type: "input",
              name: "person_position",
              className: "form-part-itemwrap person_position",
              required: true,
              config: {
                label: "当前职业",
                placeholder: "请填写当前职业",
              }
            },

            {
              type: "input",
              name: "person_company",
              className: "form-part-itemwrap person_company",
              config: {
                label: "工作单位",
                placeholder: "请填写工作单位",
              }
            },

            {
              type: "input",
              name: "person_workspace",
              className: "form-part-itemwrap person_workspace",
              config: {
                label: "工作地址",
                placeholder: "请填写工作地址",
              }
            },

            {
              type: "input",
              name: "person_workname",
              className: "form-part-itemwrap person_workname",
              config: {
                label: "工作职责",
                placeholder: "请填写工作职责或专业名称",
              }
            },

            {
              type: "input",
              name: "person_work_start_date",
              className: "form-part-itemwrap person_work_start_date",
              config: {
                label: "入职(开学)时间",
                type: "date",
              }
            },

            {
              type: "label-line",
              name: "person_info_line_1",
              className: "form-part-itemwrap",
              config: {
                label: "过去的教育经历",
              }
            },

            {
              type: "input-group",
              name: "person_info_edu_highschool",
              className: "form-part-itemwrap person_info_edu_highschool",
              config: {
                label: "高中",
                inputs: [
                  {
                    name: "edu_highschool_name",
                    label: "学校名称",
                  },
                  {
                    name: "edu_highschool_address",
                    label: "学校地址",
                  },
                  {
                    name: "edu_highschool_start_date",
                    type: "date",
                    label: "入读时间",
                  },
                  {
                    name: "edu_highschool_end_date",
                    type: "date",
                    label: "毕业时间",
                  },
                ]
              }
            },

            {
              type: "input-group",
              name: "person_info_edu_university",
              className: "form-part-itemwrap person_info_edu_university",
              config: {
                label: "大学",
                inputs: [
                  {
                    name: "edu_university_name",
                    label: "学校名称",
                  },
                  {
                    name: "edu_university_address",
                    label: "学校地址",
                  },
                  {
                    name: "edu_university_profession",
                    label: "专业",
                  },
                  {
                    name: "edu_university_degree",
                    label: "学位",
                  },
                  {
                    name: "edu_university_start_date",
                    type: "date",
                    label: "入读时间",
                  },
                  {
                    name: "edu_university_end_date",
                    type: "date",
                    label: "毕业时间",
                  },
                ]
              }
            },

            {
              type: "label-line",
              name: "person_info_line_2",
              className: "form-part-itemwrap",
              config: {
                label: "过去的工作经历",
              }
            },

            {
              type: "input-group",
              name: "person_info_work_process_1",
              className: "form-part-itemwrap person_info_work_process_1",
              config: {
                label: "工作经历1",
                inputs: [
                  {
                    name: "work_process_company",
                    label: "单位名称",
                  },
                  {
                    name: "work_process_phone",
                    label: "单位电话",
                  },
                  {
                    name: "work_process_address",
                    label: "单位地址",
                  },
                  {
                    name: "work_process_boss",
                    label: "雇主姓名",
                  },
                  {
                    name: "work_process_start_date",
                    type: "date",
                    label: "入职时间",
                  },
                  {
                    name: "work_process_end_date",
                    type: "date",
                    label: "离职时间",
                  },
                ]
              }
            },

            {
              type: "input-group",
              name: "person_info_work_process_2",
              className: "form-part-itemwrap person_info_work_process_2",
              config: {
                label: "工作经历2",
                inputs: [
                  {
                    name: "work_process_company",
                    label: "单位名称",
                  },
                  {
                    name: "work_process_phone",
                    label: "单位电话",
                  },
                  {
                    name: "work_process_address",
                    label: "单位地址",
                  },
                  {
                    name: "work_process_boss",
                    label: "雇主姓名",
                  },
                  {
                    name: "work_process_start_date",
                    type: "date",
                    label: "入职时间",
                  },
                  {
                    name: "work_process_end_date",
                    type: "date",
                    label: "离职时间",
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

export default part6View;
