var moment = require('../../utils/moment');
Page({
  data: {
    showTopTips: false,
    tcName: '',
    tcDateFm: moment("2018-01-01", "YYYY-MM-DD").format("l"),
    tcTimeFm: "00:00:00",
    tcDateTo: moment().format("l"),
    tcTimeTo: "23:59:59"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var new_data = Object.assign({}, this.data, options);
    this.setData(new_data);
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
    this.setData({
      tcDateFm: e.detail.value
    });
  },
  changeTimeFm: function (e) {
    this.setData({
      tcTimeFm: e.detail.value
    });
  },
  changeDateTo: function (e) {
    this.setData({
      tcDateTo: e.detail.value
    });
  },
  changeTimeTo: function (e) {
    this.setData({
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
  }
});