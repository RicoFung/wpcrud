// 默认配置
var DEFAULT_CONFIG = {
  param: {
    order: 'asc',
    limit: 5,
    offset: 0
  }
};
// Page配置
Page(
  {
    data: {
      param: DEFAULT_CONFIG.param, // 查询参数
      list: [], // 查询结果集
      total: 0, // 总数据条数
      totalSelected: 0, // 总已选数据条数
      isAllSelect: false, // 是否全选状态
      isHideBottomLoading: true // 是否隐藏底部刷新标志
    },

    /***********************************************************
     * on 生命周期函数
     ***********************************************************/

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

    /***********************************************************
     * fn 函数 
     ***********************************************************/

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
        this.fnRefreshSelect("top");
      } 
      else {// 底部刷新
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
        this.fnRefreshSelect("bottom");
      }
    },

    /**
     * 刷新选择状态
     */
    fnRefreshSelect: function (option) {
      // 顶部刷新
      if (option == "top") { 
        this.setData({
          isAllSelect: false,
          totalSelected: 0
        });
      } 
      // 底部刷新
      else if (option == "bottom") {
         // 全选
        if (this.data.isAllSelect) { 
          var countSelected = this.data.list.length;
          for (var i = 0; i < this.data.list.length; i++) {
            this.data.list[i].isSelect = true;
          }
          this.setData({
            list: this.data.list,
            isAllSelect: true,
            totalSelected: countSelected
          });
        } 
        // 非全选
        else { 
        }
      }
    },

    /**
     * 数量变化处理
     */
    fnHandleQuantityChange: function (e) {
      var componentId = e.componentId;
      var quantity = e.quantity;
      this.data.list[componentId].count.quantity = quantity;
      this.setData({
        list: this.data.list
      });
    },

    /***********************************************************
     * bindtap 事件 
     ***********************************************************/
    /**
     * 单选切换
     */
    tapSwitchSelect: function (e) {
      // 获取item项的id，和数组的下标值  
      let id = e.target.dataset.id;
      let index = parseInt(e.target.dataset.index);
      this.data.list[index].isSelect = !this.data.list[index].isSelect;
      // 统计选项
      if (this.data.list[index].isSelect) {
        this.data.totalSelected++;
      }
      else {
        this.data.totalSelected--;
      }
      // 全选判断
      if (this.data.list.length == this.data.totalSelected) {
        this.data.isAllSelect = true;
      }
      else {
        this.data.isAllSelect = false;
      }
      // 更新data
      this.setData({
        list: this.data.list,
        totalSelected: this.data.totalSelected,
        isAllSelect: this.data.isAllSelect,
      });
    },

    /**
     * 全选切换
     */
    tapSwitchSelectAll: function (e) {
      // 处理全选逻辑
      var countSelected = 0;
      if (!this.data.isAllSelect) {
        for (var i = 0; i < this.data.list.length; i++) {
          this.data.list[i].isSelect = true;
        }
        countSelected = this.data.list.length;
      } else {
        for (var i = 0; i < this.data.list.length; i++) {
          this.data.list[i].isSelect = false;
        }
        countSelected = 0;
      }
      // 更新data
      this.setData({
        list: this.data.list,
        isAllSelect: !this.data.isAllSelect,
        totalSelected: countSelected
      });
    },

    /**
     * 去删除
     */
    tapDelete: function() {
      wx.showToast({
        title: '删除',
        icon: 'success',
        duration: 3000
      });
      this.setData({
        showDialog: !this.data.showDialog
      });
    },

    tapActionSheet: function () {
      wx.showActionSheet({
        itemList: ['A', 'B', 'C'],
        success: function (res) {
          if (!res.cancel) {
            console.log(res.tapIndex)
          }
        }
      });
    }
  });