import cubec from 'cubec';

const {
  _isString,
  _isArray,
  _isFn,
  _isDefine,
  _isBool,
  _trim
} = cubec.struct;

const _checkreg = /[-/\\^$*+?.()|[\]{}]/g;
const _replaceto = '\\$&';

// checker form item validation
const createValidate = function(validate, value, formData, isRequired){
  let errmsg = "填写数据格式错误";

  if(validate == null) return true;

  if(isRequired && (value === "" || value == null))
    return "请填写该必填选项";

  if(_isBool(validate))
    return true;

  if(!isRequired && (value === "" || value === null))
    return true;

  if(_isFn(validate))
    errmsg = validate(value, formData) || errmsg;
  else if(validate && _isString(validate))
    errmsg = (new RegExp(_trim(validate).replace(_checkreg, _replaceto), "i")).test(value) ? true : errmsg;
  else if(_isDefine(validate, "RegExp"))
    errmsg = validate.test(value) ? true : errmsg;
  else if(
    _isArray(validate) &&
    _isDefine(validate[0], "RegExp") &&
    _isString(validate[1])
  )
    errmsg = validate[0].test(value) ? true : validate[1];
  else if(
    _isArray(validate) &&
    _isFn(validate[0]) &&
    _isString(validate[1])
  )
    errmsg = validate[0](value) ? true : validate[1];

  return errmsg;
};

export default createValidate;
