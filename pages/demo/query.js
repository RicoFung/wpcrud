Page(
  {
    data: {
      isAllSelect: false,
      totalMoney: 0,
      // 商品详情介绍
      carts: [],
      total: 0,
      param: {
        order: 'asc',
        limit: 5,
        offset: 0
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getList();
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
      this.setData({
        param: {
          order: 'asc',
          limit: 5,
          offset: 0
        }
      });
      this.getList();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
      this.getList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 获取列表数据
     */
    getList: function(){
      var that = this;
      if (this.data.total>0 && this.data.carts.length+this.data.param.limit > this.data.total) return;
      wx.request({
        url: 'https://119.23.57.155:9443/wp_crud/wp/tbdemo/query2.action',
        //url: 'http://192.168.154.169:9090/wp_crud/wp/tbdemo/query2.action', //仅为示例，并非真实的接口地址
        data: that.data.param,
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          that.refreshList(res.data);
        },
        fail: function(res) {
          console.log(res.data);

          wx.showModal({
            title: 'fail',
            content: JSON.stringify(res),
          });
        }
      })
    },
    
    /**
     * 刷新列表
     */
    refreshList: function(data) {
      if(this.data.param.offset==0) {
        this.setData({
          carts: data.rows,
          total: data.total,
          param: {
            order: this.data.param.order,
            offset: this.data.param.offset + data.rows.length,
            limit: this.data.param.limit
          }
        });
      } else {
        var new_carts = this.data.carts.concat(data.rows);
        this.setData({
          carts: new_carts,
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
    switchSelect: function (e) {
      // 获取item项的id，和数组的下标值  
      var Allprice = 0, i = 0;
      let id = e.target.dataset.id,

        index = parseInt(e.target.dataset.index);
      this.data.carts[index].isSelect = !this.data.carts[index].isSelect;
      //价钱统计
      if (this.data.carts[index].isSelect) {
        this.data.totalMoney = this.data.totalMoney + this.data.carts[index].price;
      }
      else {
        this.data.totalMoney = this.data.totalMoney - this.data.carts[index].price;
      }
      //是否全选判断
      for (i = 0; i < this.data.carts.length; i++) {
        Allprice = Allprice + this.data.carts[i].price;
      }
      if (Allprice == this.data.totalMoney) {
        this.data.isAllSelect = true;
      }
      else {
        this.data.isAllSelect = false;
      }
      this.setData({
        carts: this.data.carts,
        totalMoney: this.data.totalMoney,
        isAllSelect: this.data.isAllSelect,
      })
    },
    //全选
    allSelect: function (e) {
      //处理全选逻辑
      let i = 0;
      if (!this.data.isAllSelect) {
        for (i = 0; i < this.data.carts.length; i++) {
          this.data.carts[i].isSelect = true;
          this.data.totalMoney = this.data.totalMoney + this.data.carts[i].price;
        }
      }
      else {
        for (i = 0; i < this.data.carts.length; i++) {
          this.data.carts[i].isSelect = false;
        }
        this.data.totalMoney = 0;
      }
      this.setData({
        carts: this.data.carts,
        isAllSelect: !this.data.isAllSelect,
        totalMoney: this.data.totalMoney,
      })
    },
    // 去结算
    toBuy() {
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
    handleQuantityChange(e) {
      var componentId = e.componentId;
      var quantity = e.quantity;
      this.data.carts[componentId].count.quantity = quantity;
      this.setData({
        carts: this.data.carts,
      });
    }
  });