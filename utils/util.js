const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getSelectedValues (key, rows) {
  var s = '';
  for (var i = 0; i < rows.length; i++) {
    var r = rows[i];
    if (r.isSelect) {
      s = s + r[key] + ',';
    }
  }
  s = s.substring(0, s.length - 1);
  return s;
}

function showTopTips(_this, msg) {
  _this.setData({
    toptips: {
      show: true,
      msg: msg
    }
  });
  setTimeout(function () {
    _this.setData({
      toptips: {
        show: false,
        msg: msg
      }
    });
  }, 2000);
}

module.exports = {
  formatTime: formatTime,
  getSelectedValues: getSelectedValues,
  showTopTips: showTopTips
}
