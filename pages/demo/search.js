var moment = require('../../utils/moment');
Page({
  data: {
    showTopTips: false,
    fmDate: moment().format("l"),
    fmTime: "00:00",
    toDate: moment().format("l"),
    toTime: "23:59"
  },
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  changeFmDate: function (e) {
    this.setData({
      fmDate: e.detail.value
    });
  },
  changeFmTime: function (e) {
    this.setData({
      fmTime: e.detail.value
    });
  },
  changeFmDate: function (e) {
    this.setData({
      toDate: e.detail.value
    });
  },
  changeToTime: function (e) {
    this.setData({
      toTime: e.detail.value
    });
  }
});