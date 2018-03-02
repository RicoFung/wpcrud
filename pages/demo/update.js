// pages/demo/update.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    wx.showLoading({ title: '加载中' });
    wx.request({
      //url: 'https://119.23.57.155:9443/wp_crud/wp/tbdemo/get.action',
      url: 'http://localhost:9090/wp_crud/admin/api/tbdemo/get.action', //仅为示例，并非真实的接口地址
      data: { tcRowid: that.data.tcRowid },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.statusCode == "200") {
          if (res.data.success) {
            that.fnRefreshData(res.data.data);
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
        // console.log(res.data);
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
    var that = this;
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    wx.showLoading({ title: '保存中' });
    wx.request({
      //url: 'https://119.23.57.155:9443/wp_crud/wp/tbdemo/get.action',
      url: 'http://localhost:9090/wp_crud/admin/api/tbdemo/upd.action', //仅为示例，并非真实的接口地址
      data: {
        tcRowid: e.detail.value.tcRowid,
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
    var arr = this.data.tcDate.split(" ");
    this.setData({
      tcRowid: this.data.tcRowid,
      tcPic: this.data.tcPic,
      tcName: this.data.tcName,
      tcPrice: this.data.tcPrice,
      tcDate: this.data.tcDate,
      vDate: arr[0],
      vTime: arr[1].substr(0, 5)
    });
  }
})