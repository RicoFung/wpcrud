// 引入 js ////////////////////////////////////////
import WxValidate from '../../utils/WxValidate'
var moment = require('../../utils/moment');
//////////////////////////////////////////////////
/**
 * 获取默认param
 */
function getDefaultParam() {
  return {
    order: 'desc',
    sort: 'tcRowid',
    limit: 5,
    offset: 0,
    tcName: '',
    tcDateFm: moment("2018-01-01", "YYYY-MM-DD").format("l"),
    tcTimeFm: "00:00:00",
    tcDateTo: moment("2020-01-01", "YYYY-MM-DD").format("l"),
    tcTimeTo: "23:59:59"
  };
}
/**
 * 赋值param
 */
function setParam(_this, _param) {
  var new_param = Object.assign({}, _this.data.param, _param);
  _this.setData({ param: new_param });
}

/**
 * 自定义表单校验
 */
function initValidate() {
  // 验证字段的规则
  const rules = {
    tcName: {
      required: true
    },
    tcPrice: {
      required: true,
      number: true
    }
  };
  // 验证字段的提示信息，若不传则调用默认的信息
  const messages = {
    tcName: {
      required: '请输入名称'
    },
    tcPrice: {
      required: '请输入价钱'
    }
  };
  // 创建实例对象
  this.WxValidate = new WxValidate(rules, messages);
}
/** 
 * export
 */
module.exports = {
  getDefaultParam: getDefaultParam,
  setParam: setParam,
  initValidate: initValidate
}