import JsForm from 'JSFORM/jsform';
import ReactDOM from 'react-dom';
import React from 'react';

const Reactinput = function(props){
  const { name, config, isReuqired, value, scope, errmsg } = props;

  return (
    <div className={ errmsg ? "form-item-group invalid" : "form-item-group" }>
      <label htmlFor={name}>
        <span>{config.label}</span>
        { isReuqired &&
        <i className="icon ion-ios-medical form-item-required"></i> }
      </label>
      <input 
        className={`form-plugin-${name}`}
        name={name}
        onChange={(e)=>{scope.setValue(e.currentTarget.value)}}
        placeholder={config.placeholder}
        type={config.type || "text"}
        value={value} />
    </div>
  );
};

export default JsForm.registerPlugin({
  type: "react-input",

  description: "react-input 组件",

  init(){
    this.count = 0;
  },

  render(errmsg){
    const scope = this;

    ReactDOM.render(
      <Reactinput
         name={scope.name}
         config={scope.config}
         isReuqired={!!scope.required}
         value={scope.value != null ? scope.value : ""}
         scope={scope}
         errmsg={errmsg}
      />,
      scope.root
    );

    return ()=>ReactDOM.unmountComponentAtNode(scope.root);
  },

});
