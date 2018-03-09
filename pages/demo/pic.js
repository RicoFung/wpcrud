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
    tcDemoRowid: '',
    rows: [],
    uploader_files: [],
    uploader_files_paths: [],
    uploader_files_max: 9,
    uploader_files_can: 9,
    uploader_files_now: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tcDemoRowid: options.tcDemoRowid
    });
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
   * tap 函数 
   ***********************************************************/
  /**
   * 选择图片
   */
  tapChooseImage: function (e) {
    console.log(e);
    var that = this;
    wx.chooseImage({
      count: this.data.uploader_files_can,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(that.data.uploader_files_can)
        if (res.tempFiles.length > that.data.uploader_files_can) {
          util.showTopTips(that, '超过限制数');
          return;
        }
        that.data.uploader_files = that.data.uploader_files.concat(res.tempFiles);
        that.data.uploader_files_paths = that.data.uploader_files_paths.concat(res.tempFilePaths);
        that.data.uploader_files_now += res.tempFiles.length;
        that.data.uploader_files_can = that.data.uploader_files_max - that.data.uploader_files_now;

        that.setData({
          uploader_files: that.data.uploader_files,
          uploader_files_paths: that.data.uploader_files_paths,
          uploader_files_now: that.data.uploader_files_now,
          uploader_files_can: that.data.uploader_files_can
        });
      }
    });
  },

  /**
   * 预览图片
   */
  tapPreviewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.uploader_files_paths // 需要预览的图片http链接列表
    });
  },

  /**
   * 删除图片
   */
  tapDeleteImage: function (e) {
    // var index = e.currentTarget.dataset.index;
    // var files = this.data.uploader_files;
    // var files_paths = this.data.uploader_files_paths;
    // files.splice(index, 1);
    // files_paths.splice(index, 1);
    // this.setData({
    //   uploader_files: files,
    //   uploader_files_paths: files_paths
    // });
  },

  /***********************************************************
   * fn 函数 
   ***********************************************************/
  fnUpload: function () {
    console.log(this.data.uploader_files)
    var that = this;
    // 传入表单数据，调用验证方法
    if (this.data.uploader_files_paths.length < 1) {
      util.showTopTips(this, '请选择图片');
      return false;
    }

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
            resolve(res.data);
            that.setData({
              rows: res.data.data
            })
          },
          fail: function (err) {
            reject(new Error('failed to upload file'));
          }
        });
      });
    }));
    promise.then(function (results) {
      console.log(results);
    }).catch(function (err) {
      console.log(err);
    });
    // for (var i = 0; i < this.data.uploader_files_paths.length; i++) {
    //   wx.showLoading({ title: 'Loading...' });; // 显示加载
    //   wx.showNavigationBarLoading(); //在标题栏中显示加载
    // wx.uploadFile({
    //   url: _setting_.getUrl('tbpic/add'),
    //   filePath: that.data.uploader_files_paths[i],
    //   name: 'myFile',
    //   formData: {
    //     'tcDemoRowid': that.data.tcRowid
    //   },
    //   success: function (res) {
    //     var data = res.data;
    //     console.log(data);
    //   },
    //   fail: function (res) {
    //     console.log(res);
    //   },
    //   complete: function () {
    //     wx.hideLoading(); //隐藏加载
    //     wx.hideNavigationBarLoading(); //完成停止加载
    //   }
    // });
    // }
  },

  /***********************************************************
   * form 函数 
   ***********************************************************/

  /**
   * 提交
   */
  formSubmit: function (e) {
    console.log(this.data.uploader_files)
    var that = this;
    // 传入表单数据，调用验证方法
    if (this.data.uploader_files_paths.length < 1) {
      util.showTopTips(this, '请选择图片');
      return false;
    }

    var promise = Promise.all(this.data.uploader_files_paths.map((tempFilePath, index) => {
      return new Promise(function (resolve, reject) {
        wx.uploadFile({
          url: _setting_.getUrl('tbpic/upload'),
          filePath: tempFilePath,
          name: 'myFile',
          formData: {
            'tcDemoRowid': that.data.tcRowid
          },
          success: function (res) {
            resolve(res.data);
          },
          fail: function (err) {
            reject(new Error('failed to upload file'));
          }
        });
      });
    }));
    promise.then(function (results) {
      console.log(results);
    }).catch(function (err) {
      console.log(err);
    });
    // for (var i = 0; i < this.data.uploader_files_paths.length; i++) {
    //   wx.showLoading({ title: 'Loading...' });; // 显示加载
    //   wx.showNavigationBarLoading(); //在标题栏中显示加载
      // wx.uploadFile({
      //   url: _setting_.getUrl('tbpic/add'),
      //   filePath: that.data.uploader_files_paths[i],
      //   name: 'myFile',
      //   formData: {
      //     'tcDemoRowid': that.data.tcRowid
      //   },
      //   success: function (res) {
      //     var data = res.data;
      //     console.log(data);
      //   },
      //   fail: function (res) {
      //     console.log(res);
      //   },
      //   complete: function () {
      //     wx.hideLoading(); //隐藏加载
      //     wx.hideNavigationBarLoading(); //完成停止加载
      //   }
      // });
    // }
  },
  /**
   * 重置
   */
  formReset: function () {
    this.setData({
      uploader_files: [],
      uploader_files_paths: [],
      uploader_files_max: 9,
      uploader_files_can: 9,
      uploader_files_now: 0
    });
  }
})