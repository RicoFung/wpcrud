// pages/demo/update.js
// 引入 js ////////////////////////////////////////
var util = require('../../utils/util');
var moment = require('../../utils/moment');
var request = require('../../utils/request');
var _setting_ = require('_setting_');
//////////////////////////////////////////////////
Page({
  /**
   * 页面的初始数据
   */
  data: {
    toptips: {
      show: false,
      msg: ''
    },
    tcRowid: '',
    tcPic: '',
    tcName: '',
    tcPrice: 0,
    tcDate: '',
    vDate: '',
    vTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _setting_.initValidate();
    this.setData({
      tcRowid: options.tcRowid
    });
    this.fnGet();
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
    this.fnUpperRefresh();
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
   * 顶部刷新
   */
  fnUpperRefresh: function () {
    this.fnGet();
  },

  /**
   * 获取明细数据
   */
  fnGet: function () {
    var that = this;
    // 发送请求
    request.send({
      // url: 'http://localhost:9090/wp_crud/admin/api/tbdemo/get.action',
      url: _setting_.getUrl('tbdemo/get'),
      data: { tcRowid: that.data.tcRowid },
      onRequestSuccess: function (res) {
        that.fnRefreshData(res.data.data);
      }
    });
  },

  /**
   * 刷新数据
   */
  fnRefreshData: function (data) {
    var arr = data.po.tcDate.split(" ");
    this.setData({
      tcRowid: data.po.tcRowid,
      tcPic: data.po.tcPic,
      tcName: data.po.tcName,
      tcPrice: data.po.tcPrice,
      tcDate: data.po.tcDate,
      vDate: arr[0],
      vTime: arr[1].substr(0,5)
    });
  },

  /**
   * 提交
   */
  formSubmit: function (e) {
    // 传入表单数据，调用验证方法
    if (!_setting_.WxValidate.checkForm(e)) {
      var error = _setting_.WxValidate.errorList[0];
      util.showTopTips(this, error.msg);
      return false;
    }
    // 发送请求
    request.send({
      // url: 'http://localhost:9090/wp_crud/admin/api/tbdemo/upd.action',
      url: _setting_.getUrl('tbdemo/upd'),
      data: {
        tcRowid: e.detail.value.tcRowid,
        tcPic: e.detail.value.tcPic,
        tcName: e.detail.value.tcName,
        tcPrice: e.detail.value.tcPrice,
        tcDate: e.detail.value.vDate + ' ' + e.detail.value.vTime
      },
      onRequestSuccess: function (res) {
        wx.reLaunch({ url: 'query' });
      }
    });
  },

  /**
   * 重置
   */
  formReset: function () {
    this.setData({
      tcRowid: this.data.tcRowid,
      tcPic: this.data.tcPic,
      tcName: this.data.tcName,
      tcPrice: this.data.tcPrice,
      tcDate: moment().format("YYYY-MM-DD h:mm"),
      vDate: moment().format("l"),
      vTime: moment().format("h:mm")
    });
  }
})