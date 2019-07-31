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

import part1 from './form/part1';
import part2 from './form/part2';
import part3 from './form/part3';
import part4 from './form/part4';
import part5 from './form/part5';
import part6 from './form/part6';

window.p1 = part1;

const App = cubec.view({
  forms: {
    part1,
    part2,
    part3,
    part4,
    part5,
    part6
  },

  template: `
    <div class="form-logo">
      <img src="https://s2.ax1x.com/2019/07/06/Z0st3R.png" alt="aucan" class="form-logo_img" />
      <h3 class="form-logo_title">美国签证申请表</h3>
    </div>

    <slot>forms.part1</slot>
    <slot>forms.part2</slot>
    <slot>forms.part3</slot>
    <slot>forms.part4</slot>
    <slot>forms.part5</slot>
    <slot>forms.part6</slot>

    <div class="form-submit">
      <button class="form-submit-button" id="submit">提交表单</button>
    </div>
  `
});


App.mount(document.getElementById("app"), {});
