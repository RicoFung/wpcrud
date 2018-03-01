// 引入 js ////////////////////////////////////////
var _setting_ = require('_setting_.js');
//////////////////////////////////////////////////
Page({
  data: {
    showTopTips: false,
    param: _setting_.getDefaultParam(), // 查询参数
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _setting_.setParam(this, options);
  },
  // tapSearch: function () {
  //   var that = this;
  //   this.setData({
  //     showTopTips: true
  //   });
  //   setTimeout(function () {
  //     that.setData({
  //       showTopTips: false
  //     });
  //   }, 3000);
  // },
  changeDateFm: function (e) {
    _setting_.setParam(this, {
      tcDateFm: e.detail.value
    });
  },
  changeTimeFm: function (e) {
    _setting_.setParam(this, {
      tcTimeFm: e.detail.value
    });
  },
  changeDateTo: function (e) {
    _setting_.setParam(this, {
      tcDateTo: e.detail.value
    });
  },
  changeTimeTo: function (e) {
    _setting_.setParam(this, {
      tcTimeTo: e.detail.value
    });
  },
  /**
   * 搜索
   */
  formSubmit: function (e) {
    wx.reLaunch({
      url: 'query'
      + '?tcName=' + e.detail.value.tcName 
      + '&tcDateFm=' + e.detail.value.tcDateFm
      + '&tcTimeFm=' + e.detail.value.tcTimeFm
      + '&tcDateTo=' + e.detail.value.tcDateTo
      + '&tcTimeTo=' + e.detail.value.tcTimeTo
    });
  },
  /**
   * 重置
   */
  formReset: function () {
    _setting_.setParam(this, _setting_.getDefaultParam());
  }
});