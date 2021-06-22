// pages/home/index.js
import regeneratorRuntime from "../../libs/regenerator/runtime-module";
import {checkLogin} from "../../utils/util";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isMusicPlay: getApp().globalData.isMusicPlay,//全局是否播放
    musicId:getApp().globalData.musicId,//全局播放id
    musicImg:getApp().globalData.musicImg,
    currentIndex: 0,//当前轮播图的索引
    propData:[],//轮播图数据
    bookImg:[],//书的图片
    column:[],//栏目数组
    recentData:[],//最近收听
    listData: [], //CMAS列表数组
    maData:[],//音频杂志杂志数据
    newList:[],//重新组合的猜你喜欢数组
    likeData:[],//猜你喜欢数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that=this;
    //换一批功能
    // that.chooseEvent();
  },
 
  //首页数据
 listDataFn(){
  let that = this;
  var listurl = 'https://walkm.chinamas.cn/walk/show';
  wx.request({
    //上线接口地址要是https测试可以使用http接口方式
    url: listurl,
    method: 'GET',
    header: {
      'content-type': 'application/json',
    },
    data:{
      uid:wx.getStorageSync('userInfo').uid,
    },
    success: function (res) {
      if(res.data.bol){
          that.setData({
            propData: res.data.data.advert,//轮播图
            recentData: res.data.data.recent, //最近收听
            column:res.data.data.column,//栏目
            bookImg:res.data.data.middle_advert,//广告书
            listData:res.data.data.top_two,
            maData:res.data.data.ma_new_two,
            likeData:res.data.data.top_five,
          });
      }else{
        wx.showToast({ title: res.data.err_msg, icon: "none" });
      }
    },
  })
},

  //轮播图切换
  changeSwiper: function (e) {
    this.setData({
    currentIndex: e.detail.current
    })
  },

  //点击换一批
  chooseEvent: function () {
    let maxNum = this.data.likeData.length  //计算数据长度
    let r1 = parseInt(Math.random() * (maxNum - 0) + 0); //取【0-数据长度】内的整数随机数
    let r2 = parseInt(Math.random() * (maxNum - 0) + 0);
    let r3 = parseInt(Math.random() * (maxNum - 0) + 0);
    let r4 = parseInt(Math.random() * (maxNum - 0) + 0); 
    let r5 = parseInt(Math.random() * (maxNum - 0) + 0); 
    //务必先清空列表数据
    this.setData({
      newList: []
    })
    //重新取四组数据
    this.data.newList.push(this.data.likeData[r1])
    this.data.newList.push(this.data.likeData[r2])
    this.data.newList.push(this.data.likeData[r3])
    this.data.newList.push(this.data.likeData[r4])
    this.data.newList.push(this.data.likeData[r5])
    //重新赋值
    this.setData({
      newList: this.data.newList
    })
  },
  //点击历史收听
  listenFn(e){
    console.log(e)
    let listenId=e.currentTarget.dataset.id;
    let speed =e.currentTarget.dataset.speed;
    checkLogin(`/pages-homes/play/index?mwaId=${listenId}&speed=${speed}`,1,true,1);
  },
  //点击栏目跳转
  columnFn(e){
    let mwc_id=e.currentTarget.dataset.mwc_id;
    let mwc_title=e.currentTarget.dataset.mwc_title;
    checkLogin(`/pages-homes/column/index?mwc_id=${mwc_id}&mwc_title=${mwc_title}`,1,true,1);
  },

  //点击CMAS新推荐
  recommendFn(e){
    console.log(e)
    let listenId=e.currentTarget.dataset.id;
    checkLogin('/pages-homes/play/index?musicId='+listenId,1,true,1);
  },
  //音频杂志点击更多
  moreFn(){
    checkLogin('/pages-homes/magazine/index',1,true,1);
  },
  //跳转到搜索页面
  toSearch(){
    checkLogin('/pages-homes/search1/index',1,true,1);
  },
  //返回当前播放页
  backFn(){
    wx.navigateTo({
      url: '/pages-homes/play/index?mwaId='+ this.data.musicId,
    })
  },
  //单期杂志
  singleFn(e){
    let mId=e.currentTarget.dataset.id;
    let title=e.currentTarget.dataset.title;
    let year=e.currentTarget.dataset.year;
    checkLogin(`/pages-homes/magazine/index?mId=${mId}&title=${title}&year=${year}`,1,true,1);
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
    //首页数据
    this.listDataFn();
    this.setData({
      isMusicPlay:getApp().globalData.isMusicPlay,
      musicId:getApp().globalData.musicId,
      musicImg:getApp().globalData.musicImg,
    })
    console.log(getApp().globalData.isMusicPlay,getApp().globalData.musicId,'====')
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

  }
})