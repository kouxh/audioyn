// pages-homes/ranking/index.js
import {checkLogin} from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], //展示列表数组
    AllData:[],//总数组
    pageIndex: 1,
    pageSize: 10,
    total: 0, //列表总条数
    listShowType: 0, // 列表显示状态 0加载中 1有 2无
    finished: false,//数据是否加载完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //数据列表
    this.freeListFn();
  },
  /**
  * 监听 TabBar 切换点击
  */
  onTabItemTap: function (item) {
    checkLogin('/pages/free/index',1,true,2);
  },

  //数据列表
  freeListFn(){
  let that = this;
  getApp().globalData.api.freeList({
  }).then(res=>{
    if(res.bol==true){
      that.setData({
        AllData:res.data,
        total:res.data.length
      });
      this.loadmore();
    }else{
      wx.showToast({ title: res.data.msg, icon: "none" });
    }
  })
  },
  // 滑动加载
  loadmore(){
    let that=this;
    let _this = this.data;
    //  //加载提示
      wx.showLoading({
      title: '加载中',
    })
    if(_this.total / _this.pageSize > _this.pageIndex){
      that.setData({
        listData:_this.listData.concat(_this.AllData.slice((_this.pageIndex-1) * _this.pageSize, _this.pageIndex * _this.pageSize)),
        pageIndex: _this.pageIndex + 1 ,
      })
    }else{
      that.setData({
        listData:_this.AllData,
        finished: true,// 数据全部加载完成
      })
    }
    setTimeout(function () {
      that.setData({ listShowType: _this.total ? 1 : 2 });
    }, 300);
    wx.hideLoading();
  },

  //跳转到搜索页面
  toSearch(){
    wx.navigateTo({
      url: '/pages-homes/search1/index',
    })
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
    if(!this.data.finished){
      this.loadmore();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})