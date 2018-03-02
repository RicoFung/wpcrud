var moment = require('../../utils/moment');
/**
 * 获取默认param
 */
function getDefaultParam() {
  return {
    order: 'asc',
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
 * export
 */
module.exports = {
  getDefaultParam: getDefaultParam,
  setParam: setParam
}