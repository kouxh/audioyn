// pages/home/index.js
import regeneratorRuntime from "../../libs/regenerator/runtime-module";
import {checkLogin} from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,//当前轮播图的索引
    propData:[{
        event_value:1,
        event_type:1,
        images_url:'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg'
        },
        {
          event_value:2,
          event_type:2,
          images_url:'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg'
        }
      ,{
        event_value:3,
        event_type:3,
        images_url:'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg'
      }
    ],//轮播图数据
    column:[],//栏目数组
    recent:[],//最近收听
    listData: [
      {
        id:1,
        img:"https://march.yuanian.com/static/assets/img/none.png",
        title:"音频标题标题标题标题标题标题标题标题",
        num:2,
        author:'作者姓名',
        isBalloon:false,//是否展示操作框
      },
      {
        id:2,
        img:"https://march.yuanian.com/static/assets/img/none.png",
        title:"音频标题标题标题标题标题标题标题标题",
        num:2,
        author:'作者姓名',
        isBalloon:false,//是否展示操作框
      },
     
    ], //CMAS列表数组
    maData:[],//音频杂志杂志数据
    newList:[],//重新组合的猜你喜欢数组
    likeData:[
      { name:"音频标题标题标题标题标题标题1",
        column:'栏目'
      },
    ],//猜你喜欢数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    //首页数据
    that.listDataFn();
    //换一批功能
    that.chooseEvent();
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
    success: function (res) {
      if(res.data.bol){
          that.setData({
            // propData: res.data.adver,//轮播图
            // recent: res.data.recent, //最近收听
            column:res.data.data.column,//栏目
            listData:res.data.data.top_two,
            maData:res.data.data.ma_new_two,
            likeData:res.data.data.top_five,
          });
          console.log(res.data.ma_new_two,)
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
    let listenId=e.currentTarget.dataset.id;
    checkLogin('/pages-homes/play/index?mwaId='+listenId,1,true,1);
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
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
    // var self = this;
	 	// setTimeout(() => {
	  // 	// 模拟请求数据，并渲染
		//   	var arr = self.data.dataList, max = Math.max(...arr);
		//   	for (var i = max + 1; i <= max + 3; ++i) {
		// 		arr.unshift(i);
		// 	}
	  // 		self.setData({ dataList: arr });
		// 	  // 数据成功后，停止下拉刷新
		// 	wx.stopPullDownRefresh();
		//  }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.moreFn();
    // var arr = this.data.dataList, max = Math.max(...arr);
	 	// if (this.data.count < 3) {
		//   	for (var i = max + 1; i <= max + 5; ++i) {
		//   		arr.push(i);
		//   	}
		// 	this.setData({
		// 	  dataList: arr,
		// 	  count: ++this.data.count
		// 	 });
	 	// } else {
		// 	wx.showToast({
		// 	  title: '没有更多数据了！',
		// 	  image: '../../src/images/noData.png',
		// 	})
	 	// }
 	
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})