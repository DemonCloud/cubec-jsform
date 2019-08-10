import struct from 'ax-struct-js';

const isString = struct.type("string");
const isArray = struct.type("array");
const isFunction = struct.type("func");
const isDefine = struct.type("define");
const isBool = struct.type("bool");
const trim = struct.string("trim");

const _checkreg = /[-/\\^$*+?.()|[\]{}]/g;
const _replaceto = '\\$&';

// checker form item validation
const createValidate = function(validate, value, formData, isRequired){
  let errmsg = "填写数据格式错误";

  if(validate == null) return true;

  if(isRequired && (value === "" || value == null))
    return "请填写该必填选项";

  if(isBool(validate))
    return true;

  if(!isRequired && (value === ""|| value === null))
    return true;

  if(isFunction(validate))
    errmsg = validate(value, formData) || errmsg;
  else if(validate && isString(validate))
    errmsg = (new RegExp(trim(validate).replace(_checkreg, _replaceto), "i")).test(value) ? true : errmsg;
  else if(isDefine(validate, "RegExp"))
    errmsg = validate.test(value) ? true : errmsg;
  else if(
    isArray(validate) &&
    isDefine(validate[0], "RegExp") &&
    isString(validate[1])
  )
    errmsg = validate[0].test(value) ? true : validate[1];

  return errmsg;
};

export default createValidate;
