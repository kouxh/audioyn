// pages/member/index.js
import {dateFormatter,checkLogin} from "../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabsActive:0,//默认tabs栏
    AllData:[],//总数组
    pageIndex: 1,
    pageSize: 10,
    total: 0, //列表总条数
    finished: false,//数据是否加载完成
    buyfinished:false,//购买数据是否加载完成
    dataList:[],//最近收听数据
    listShowType: 1, // 列表显示状态 0加载中 1有 2无
    info:{
      name:"",
      tell:"",
      email:"",
      sex:"0",
      birthday:"",
      age:"20-25",
      company:"",
      occupation:"管理者"
    },
    buyData:[],//购买列表
    vipData:[],//购买VIP数据
    buyShowType: 0, // 列表显示状态 0加载中 1有 2无
    calendarShow:false,//是否展示显示日期弹框
    minDate: new Date(1960, 0, 1).getTime(),
    maxDate: new Date(2030, 12, 1).getTime(),
    currentDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }else if (type === 'day') {
        　　return `${value}日`
      } 
      return value;
    },
    option1: [
      { text: '20-25', value: 0 },
      { text: '25-35', value: 1 },
      { text: '35-45', value: 2 },
      { text: '45以上', value: 3 },
    ],
    ageValue: 0,//年龄默认值
    occValue:0,//职位默认选中值
    occOption: [
      { text: '管理者', value: 0 },
      { text: '财务人', value: 1 },
      { text: '技术人', value: 2 },
      { text: '其他', value: 3 },
    ],
    userInfo: "", //用户信息
  
  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync("userInfo"))
    // 获取用户数据
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    });
    if(this.data.ageValue==0){
      this.setData({
        "info.age":'20-25'
      })
    }
    if(this.data.occOption==0){
      this.setData({
        "info.occupation":'管理者'
      })
    }
    if(this.data.tabsActive==0){
      // 用户的基本信息
    this.getUserInfoFn();
    }
  },
  
  /**
  * 监听 TabBar 切换点击
  */
  onTabItemTap: function (item) {
    checkLogin('/pages/member/index',1,true,2);
  },
  //tabs栏切换
  onChange(event) {
    let currentIndex=event.detail.index;
    this.setData({
    listShowType:0,
    dataList:[],
    buyShowType:0,
    buyData:[]
    })
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
    if(currentIndex==0){
      this.getUserInfoFn()
    }else if(currentIndex==1){
      this.collectionListFn();
    }else if(currentIndex==2){
      this.recentListeningFn();
    }else if(currentIndex==3){
      this.purchaseRecordsFn();
    }
    this.setData({
      tabsActive:currentIndex
    })
  },
  //用户的基本信息
  getUserInfoFn(){
    let that = this;
    getApp().globalData.api.getUserInfo({
      uid:wx.getStorageSync('userInfo').uid,
    }).then(res=>{
      if(res.bol){
        that.setData({
          info:res.data,
        });
      }else{
        wx.showToast({ title: res.data.msg, icon: "none" });
      }
    })
   },
  //收藏列表
  collectionListFn(){
    let that = this;
    getApp().globalData.api.collectionList({
      uid:wx.getStorageSync('userInfo').uid,
    }).then(res=>{
      if(res.bol){
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
  //最近收听
  recentListeningFn(){
    let that = this;
    getApp().globalData.api.recentListening({
      uid:wx.getStorageSync('userInfo').uid,
    }).then(res=>{
      if(res.bol){
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
  //用户购买记录
  purchaseRecordsFn(){
    let that = this;
    getApp().globalData.api.purchaseRecords({
      uid:wx.getStorageSync('userInfo').uid,
    }).then(res=>{
      if(res.bol){
        that.setData({
          buyData:res.data.audio,
          vipData:res.data.vip,
          buyShowType:(res.data.audio.length|| res.data.vip.length)? 1 : 2,
          buyfinished:(res.data.audio.length|| res.data.vip.length)? true : false
        });
        console.log(this.data.buyShowType)
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
        dataList:_this.dataList.concat(_this.AllData.slice((_this.pageIndex-1) * _this.pageSize, _this.pageIndex * _this.pageSize)),
        pageIndex: _this.pageIndex + 1 ,
      })
     
    }else{
      that.setData({
        dataList:_this.AllData,
        finished: true,// 数据全部加载完成
      })
    }
    setTimeout(function () {
      that.setData({ listShowType: _this.total ? 1 : 2 });
    }, 300);
    wx.hideLoading();
  },
  // 切换性别
  onSwitch(event) {
    this.setData({
      'info.sex': event.detail,
    });
  },
  //日期弹框展示
  onDisplay() {
      this.setData({ calendarShow: true });
  },
  onClose() {
      this.setData({ calendarShow: !this.data.calendarShow });
  },
  // 点击确认按钮
  onConfirm(event) {
      this.setData({
        calendarShow: false,
        'info.birthday': dateFormatter(event.detail),
      });
  },
  pickerTiemFn(e){
      // console.log(e.detail.getValues().join("/"))
  },
  //年龄段切换
  itemChange(e){
    let value=e.detail
    let ageText=''
    if(value==0){
      ageText='20-25'
    }else if(value==1){
      ageText='25-35'
    }else if(value==2){
      ageText='35-45'
    }else if(value==3){
      ageText='45以上'
    }
    this.setData({
      "info.age":ageText
    })
  },
  //职位切换
  occOptionChange(e){
    let occOption=e.detail
    let occOptionText=''
    if(occOption==0){
      occOptionText='管理者'
    }else if(occOption==1){
      occOptionText='财务人'
    }else if(occOption==2){
      occOptionText='技术人'
    }else if(occOption==3){
      occOptionText='其他'
    }
    this.setData({
      "info.occOption":occOptionText
    })
  },
  //表单项内容发生改变的回调
  handleInput(event){
    let type=event.currentTarget.id;
    this.setData({
      [type]:event.detail.value
    })
  },
  // 完善信息
  changeInfo(){
    let that = this;
    if (that.data.info.name == "") {
      return wx.showToast({ title: "请输入姓名", icon: "none" });
    }if (
      !/^1[3-9]\d{9}$/.test(that.data.info.tell) ||
      that.data.info.tell == ""
    ) {
      return wx.showToast({ title: "请输入手机号", icon: "none" });
    }
    var emailStr = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if(that.data.info.email=='' ||!emailStr.test(that.data.info.email)){
      return wx.showToast({ title: "请输入正常的邮箱", icon: "none" });
    }
    var reg = /^(19|20)\d{2}-(1[0-2]|0?[1-9])-(0?[1-9]|[1-2][0-9]|3[0-1])$/
    if(that.data.info.birthday==''||!reg.test(that.data.info.birthday)){
      return wx.showToast({ title: "请选择出生日期", icon: "none" });
    }
    if(that.data.info.age==''){
      return wx.showToast({ title: "请选择年龄段", icon: "none" });
    }
    if(that.data.info.company==''){
      return wx.showToast({ title: "请输入公司名称", icon: "none" });
    }
    if(that.data.info.occupation==''){
      return wx.showToast({ title: "请选择职位", icon: "none" });
    }
    getApp().globalData.api.upUserInfo({
      uid:wx.getStorageSync('userInfo').uid,
      name:that.data.info.name,
      email:that.data.info.email,
      sex:that.data.info.sex,
      birthday:that.data.info.birthday,
      age:that.data.info.age,
      company:that.data.info.company,
      occupation:that.data.info.occupation
    }).then(res=>{
      if (res.bol == true) {
        wx.showToast({ title: res.data.msg, icon: 'success',duration:2000 });
      }else{
        wx.showToast({ title: "请先修改信息再点击提交", icon: "none" });
      }
    })
  },
  listFn(e){
    let mwaId=e.currentTarget.dataset.id
    let speed=e.currentTarget.dataset.speed
    wx.navigateTo({
      url: `/pages-homes/play/index?mwaId=${mwaId}&speed=${speed}` ,
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