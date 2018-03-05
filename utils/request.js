var default_config = {
  url: '',
  method: 'GET',
  header: {
    'content-type': 'application/json' // 默认值
    // 'content-type': 'application/x-www-form-urlencoded' 
  },
  data: {},
  onRequestBefore: function() {},
  onRequestSuccess: function (res) { },
  onRequestFail: function (res) { },
  onRequestComplete: function (res) { }
}

function send(new_config) {
  var config = Object.assign({}, default_config, new_config);
  config.onRequestBefore();
  wx.showLoading({ title: 'Loading...' });; // 显示加载
  wx.showNavigationBarLoading(); //在标题栏中显示加载
  wx.request({
    url: config.url,
    method: config.method,
    data: config.data,
    header:config.header,
    success: function (res) {
      if (res.statusCode == "200") {
        if (res.data.success) {
          config.onRequestSuccess(res);
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
        title: 'Fail',
        content: JSON.stringify(res),
        showCancel: false
      });
      config.onRequestFail(res);
    },
    complete: function () {
      wx.hideLoading(); //隐藏加载
      wx.hideNavigationBarLoading(); //完成停止加载
      config.onRequestComplete();
    }
  });
}

/** 
 * export
 */
module.exports = {
  send: send
}