// 引入 js ////////////////////////////////////////
var util = require('../../utils/util')
var moment = require('../../utils/moment')
var request = require('../../utils/request')
var _setting_ = require('_setting_')
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
    tcDemoRowid: '',
    rows: [],
    picDomain: _setting_.getPicDomain(),
    uploader_files_paths: [],
    uploader_files_max: 5,
    uploader_files_can: 5,
    uploader_files_now: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tcDemoRowid: options.tcDemoRowid
    })
    this.fnQuery()
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
    this.fnQuery()
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
   * tap 函数 
   ***********************************************************/
  /**
   * 选择图片
   */
  tapChooseImage: function (e) {
    var that = this
    wx.chooseImage({
      count: this.data.uploader_files_can,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res.tempFiles.length)
        console.log(that.data.uploader_files_can)
        if (res.tempFiles.length > that.data.uploader_files_can) {
          util.showTopTips(that, '超出限制数')
          return
        }
        that.data.uploader_files_paths = res.tempFilePaths
        that.data.uploader_files_now += res.tempFiles.length
        that.data.uploader_files_can = that.data.uploader_files_max - that.data.uploader_files_now
        that.setData({
          uploader_files_paths: that.data.uploader_files_paths,
          uploader_files_now: that.data.uploader_files_now,
          uploader_files_can: that.data.uploader_files_can
        })
        that.fnUpload()
      }
    })
  },

  /**
   * 预览图片
   */
  tapPreview: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.uploader_files_paths // 需要预览的图片http链接列表
    })
  },

  /**
   * 删除图片
   */
  tapDelete: function (e) {
    var that = this
    request.send({
      url: _setting_.getUrl('tbpic/del'),
      data: { tcRowid: e.currentTarget.dataset.tcRowid },
      onRequestSuccess: function (res) {
        that.fnQuery()
      }
    })
  },

  /***********************************************************
   * fn 函数 
   ***********************************************************/

  /**
   * 上传图片
   */
  fnUpload: function () {
    var that = this
    // 传入表单数据，调用验证方法
    if (this.data.uploader_files_paths.length < 1) {
      util.showTopTips(this, '请选择图片')
      return false
    }
    // 批量异步上传
    var promise = Promise.all(this.data.uploader_files_paths.map((tempFilePath, index) => {
      return new Promise(function (resolve, reject) {
        wx.uploadFile({
          url: _setting_.getUrl('tbpic/upload'),
          filePath: tempFilePath,
          name: 'myFile',
          formData: {
            'tcDemoRowid': that.data.tcDemoRowid
          },
          success: function (res) {
            resolve(res.data)
          },
          fail: function (err) {
            reject(new Error('failed to upload file'))
          }
        })
      })
    }))
    promise.then(function (results) {
      that.fnQuery()
    }).catch(function (err) {
      wx.showModal({
        title: 'Fail',
        content: JSON.stringify(err),
        showCancel: false
      })
    })
  },

  /**
   * 获取图片
   */
  fnQuery: function () {
    var that = this
    request.send({
      url: _setting_.getUrl('tbpic/query'),
      data: { tcDemoRowid: that.data.tcDemoRowid },
      onRequestSuccess: function (res) {
        // 获取后台数据
        var rows = res.data.data.rows
        // 清空图片路径重新赋值
        that.data.uploader_files_paths = []
        for(var i=0; i<rows.length; i++) {
          that.data.uploader_files_paths.push(that.data.picDomain+rows[i].tcName)
        }
        // 更新data
        that.setData({
          rows: res.data.data.rows,
          uploader_files_paths: that.data.uploader_files_paths,
          uploader_files_now: res.data.data.rows.length,
          uploader_files_can: that.data.uploader_files_max - res.data.data.rows.length
        })
      },
      onRequestComplete: function (res) {
        wx.stopPullDownRefresh() // 停止下拉刷新
      }
    })
  }
})