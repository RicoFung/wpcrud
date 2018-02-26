// 默认配置
var DEFAULT_CONFIG = {
  param: {
    order: 'asc',
    limit: 5,
    offset: 0
  }
};
//
Page(
  {
    data: {
      isAllSelect: false,
      isHideBottomLoading: true,
      totalMoney: 0,
      // 商品详情介绍
      list: [],
      total: 0,
      param: DEFAULT_CONFIG.param
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.fnGetList();
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
      this.fnLowerRefresh();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 显示Loading
     */
    fnShowBottomLoading: function () {
      this.setData({
        isHideBottomLoading: false
      });
    },

    /**
     * 隐藏Loading
     */
    fnHideBottomLoading: function () {
      this.setData({
        isHideBottomLoading: true
      });
    },

    /**
     * 顶部刷新
     */
    fnUpperRefresh: function () {
      this.setData({
        param: DEFAULT_CONFIG.param
      });
      this.fnGetList();
    },

    /**
     * 底部刷新
     */
    fnLowerRefresh: function () {
      if (this.data.total > 0 && this.data.list.length + this.data.param.limit > this.data.total) return;
      this.fnGetList();
    },

    /**
     * 获取列表数据
     */
    fnGetList: function(){
      var that = this;
      that.fnShowBottomLoading(); // 显示底部加载
      wx.showNavigationBarLoading(); //在标题栏中显示加载
      wx.request({
        //url: 'https://119.23.57.155:9443/wp_crud/wp/tbdemo/query2.action',
        url: 'http://localhost:9090/wp_crud/wp/tbdemo/query2.action', //仅为示例，并非真实的接口地址
        data: that.data.param,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          that.fnRefreshList(res.data);
        },
        fail: function(res) {
          console.log(res.data);
          wx.showModal({
            title: 'fail',
            content: JSON.stringify(res),
          });
        },
        complete: function () {
          that.fnHideBottomLoading(); //隐藏底部加载
          wx.hideNavigationBarLoading(); //完成停止加载
          wx.stopPullDownRefresh(); //停止下拉刷新
        }
      })
    },
    /**
     * 刷新列表
     */
    fnRefreshList: function(data) {
      if(this.data.param.offset==0) {// 顶部刷新
        this.setData({
          list: data.rows,
          total: data.total,
          param: {
            order: this.data.param.order,
            offset: this.data.param.offset + data.rows.length,
            limit: this.data.param.limit
          }
        });
      } else {// 底部刷新
        var new_list = this.data.list.concat(data.rows);
        this.setData({
          list: new_list,
          total: data.total,
          param: {
            order: this.data.param.order,
            offset: this.data.param.offset + this.data.param.limit,
            limit: this.data.param.limit
          }
        });
      }
    },
    //勾选事件处理函数  
    fnSwitchSelect: function (e) {
      // 获取item项的id，和数组的下标值  
      var Allprice = 0, i = 0;
      let id = e.target.dataset.id,

        index = parseInt(e.target.dataset.index);
      this.data.list[index].isSelect = !this.data.list[index].isSelect;
      //价钱统计
      if (this.data.list[index].isSelect) {
        this.data.totalMoney = this.data.totalMoney + this.data.list[index].price;
      }
      else {
        this.data.totalMoney = this.data.totalMoney - this.data.list[index].price;
      }
      //是否全选判断
      for (i = 0; i < this.data.list.length; i++) {
        Allprice = Allprice + this.data.list[i].price;
      }
      if (Allprice == this.data.totalMoney) {
        this.data.isAllSelect = true;
      }
      else {
        this.data.isAllSelect = false;
      }
      this.setData({
        list: this.data.list,
        totalMoney: this.data.totalMoney,
        isAllSelect: this.data.isAllSelect,
      })
    },
    //全选
    fnAllSelect: function (e) {
      //处理全选逻辑
      let i = 0;
      if (!this.data.isAllSelect) {
        for (i = 0; i < this.data.list.length; i++) {
          this.data.list[i].isSelect = true;
          this.data.totalMoney = this.data.totalMoney + this.data.list[i].price;
        }
      }
      else {
        for (i = 0; i < this.data.list.length; i++) {
          this.data.list[i].isSelect = false;
        }
        this.data.totalMoney = 0;
      }
      this.setData({
        list: this.data.list,
        isAllSelect: !this.data.isAllSelect,
        totalMoney: this.data.totalMoney,
      })
    },
    // 去结算
    fnToBuy() {
      wx.showToast({
        title: '去结算',
        icon: 'success',
        duration: 3000
      });
      this.setData({
        showDialog: !this.data.showDialog
      });
    },
    //数量变化处理
    fnHandleQuantityChange(e) {
      var componentId = e.componentId;
      var quantity = e.quantity;
      this.data.list[componentId].count.quantity = quantity;
      this.setData({
        list: this.data.list,
      });
    }
  });