// app.js
import api from "/api/api";
import { setStorage } from "utils/util";
import regeneratorRuntime from "/libs/regenerator/runtime-module";
import account from "/api/loginCode";
App({
  onLaunch() {
    // 展示本地存储能力
    let that=this;
    //获取用户本地是否是第一次进入新版本
    let token=wx.getStorageSync('token');
    let hasBindMobile = wx.getStorageSync('hasBindMobile');
    let userInfo=wx.getStorageSync('userInfo');
    let record=wx.getStorageSync('record');
    wx.clearStorageSync(); // 首次进入，清除缓存
    if (token) {
      setStorage('token', token, that);
    }
    if(hasBindMobile){
      setStorage('hasBindMobile', hasBindMobile, that);
    }
    if(userInfo){
      setStorage('userInfo', userInfo, that);
    }
    if(record){
      setStorage('record', record, that);
    }
    //判断是否过期重新登录
    // this.checkSession();

    
    // 判断是否是机型
    wx.getSystemInfo({
      success(res) {
        if (
          res.model.indexOf('iPhone X') != -1 ||
          res.model.indexOf('iPhone 11') != -1 ||
          res.model.indexOf('iPhone 12') != -1
        ) {
          that.globalData.isIphoneX = true;
        }
      }
    })
    
  },
  //判断是否过期
  async checkSession() {
    var response = await account.checkSession();
    var token=wx.getStorageSync('userInfo').token;
    if(!response || token==undefined){
      wx.showToast({
        title: "授权过期，请点击重新登录",
        icon: "none"
      });
      wx.removeStorageSync("userInfo")
      wx.removeStorageSync("hasBindMobile")
      // wx.reLaunch({
      //   url: '/pages/index/index',
      // })
      return false;
    }else{
      // wx.switchTab({
      //   url: '/pages/home/index',
      // })
    }
  },

  globalData: {
    userInfo: null,
    api, //请求方法封装
    isIphoneX: false, // 是否属于iPhone X系列
    isMusicPlay: false,//是否有音乐播放
    musicId: ''//音乐id
  }
})

