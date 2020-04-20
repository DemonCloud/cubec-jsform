import 'normalize.css';
import './index.scss';
import 'amfe-flexible';
import "./_plugins/input";
import "./_plugins/radio";
import "./_plugins/textarea";
import "./_plugins/input-group";
import "./_plugins/label-line";
import "./_plugins/react-input";
// import "./_plugins/vue-input";
import cubec from 'cubec';
import struct from 'ax-struct-js';

import parta from './form/part1';
import partb from './form/part2';
import partc from './form/part3';
import partd from './form/part4';
import parte from './form/part5';
import partf from './form/part6';

const every = struct.every();
const merge = struct.merge();
const ajax = struct.ajax();

const App = cubec.view({
  plugin: {
    parta,
    partb,
    partc,
    partd,
    parte,
    partf
  },

  events: {
    "click:.submit": function(){
      const forms = [
        parta.jsform,
        partb.jsform,
        partc.jsform,
        partd.jsform,
        parte.jsform,
        partf.jsform,
      ];

      const isValidate = every(forms.map((form)=>form.validate()), (e)=>(e===true));

      if(isValidate){
        const upFormData = merge.apply(null, forms.map(form=>form.getData()));

        ajax({
          type: "POST",

          url: "/api/form/submit",

          param: {
            name: upFormData.name,
            email: upFormData.email,
            phone: upFormData.phone,
            formType: 1,
            userId: upFormData.userId,
            formContent: JSON.stringify(upFormData)
          },

          header: {
            "Content-Type": "application/json"
          },

          success(res){
            if(res.success){
              alert("表单提交成功");
              location.reload();
            }else{
              alert("表单提交失败");
            }
          }
        });
      }else{
        alert("表单有未填写或未通过校验的字段");
      }

    }
  },

  render: `
    <div class="form">
      <div class="form-logo">
        <img src="https://s2.ax1x.com/2019/07/06/Z0st3R.png" alt="aucan" class="form-logo_img" />
        <h3 class="form-logo_title">美国签证申请表</h3>
      </div>

      <parta></parta>
      <partb></partb>
      <partc></partc>
      <partd></partd>
      <parte></parte>
      <partf></partf>

      <div class="form-submit">
        <b class="form-submit-button submit">提交表单</b>
      </div>
    </div>
  `,
});

App.mount(document.getElementById("app"), {});
