// pages/demo/add.js
// 引入 js ////////////////////////////////////////
var moment = require('../../utils/moment');
var _setting_ = require('_setting_.js');
//////////////////////////////////////////////////
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tcPic: 'ddsdfsds',
    tcName: '',
    tcPrice: 0,
    tcDate: '',
    vDate: moment().format("l"),
    vTime: moment().format("h:mm")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _setting_.initValidate();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /***********************************************************
   * change 函数 
   ***********************************************************/
  changeDate: function (e) {
    this.setData({
      vDate: e.detail.value
    });
  },
  changeTime: function (e) {
    this.setData({
      vTime: e.detail.value
    });
  },

  /***********************************************************
   * fn 函数 
   ***********************************************************/

  /**
   * 提交
   */
  formSubmit: function (e) {
    // 传入表单数据，调用验证方法
    if (!_setting_.WxValidate.checkForm(e)) {
      var error = _setting_.WxValidate.errorList[0];
      wx.showModal({
        content: error.msg,
        showCancel: false
      });
      return false;
    }
    // 发送请求
    var that = this;
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    wx.showLoading({ title: '保存中' });
    wx.request({
      //url: 'https://119.23.57.155:9443/wp_crud/wp/tbdemo/get.action',
      url: 'http://localhost:9090/wp_crud/admin/api/tbdemo/add.action', //仅为示例，并非真实的接口地址
      data: {
        tcPic: e.detail.value.tcPic,
        tcName: e.detail.value.tcName,
        tcPrice: e.detail.value.tcPrice,
        tcDate: e.detail.value.vDate + ' ' + e.detail.value.vTime
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.statusCode == "200") {
          if (res.data.success) {
            wx.reLaunch({ url: 'query' });
          }
          else {
            wx.showModal({
              title: 'Fail',
              content: JSON.stringify(res.data.msg),
              showCancel: false
            });
          }
        } else {
          wx.showModal({
            title: 'Fail',
            content: JSON.stringify(res),
            showCancel: false
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: 'fail',
          content: JSON.stringify(res),
          showCancel: false
        });
      },
      complete: function () {
        wx.hideNavigationBarLoading(); //完成停止加载
        wx.hideLoading();
      }
    });
  },
  /**
   * 重置
   */
  formReset: function () {
    this.setData({
      tcPic: this.data.tcPic,
      tcName: this.data.tcName,
      tcPrice: this.data.tcPrice,
      tcDate: moment().format("YYYY-MM-DD h:mm"),
      vDate: moment().format("l"),
      vTime: moment().format("h:mm")
    });
  }
})