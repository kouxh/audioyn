// pages-homes/ranking/index.js
import {checkLogin} from "../../utils/util";
let isSend = false;//函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], //列表数组
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
    this.recommendListFn();
  },
    /**
* 监听 TabBar 切换点击
*/
onTabItemTap: function (item) {
  checkLogin('/pages/recommend/index',1,true,2);
},
//数据列表
recommendListFn(){
  let that = this;
  getApp().globalData.api.recommendList({
    
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
    listData:_this.listData.concat(_this.AllData.slice((_this.pageIndex-1) * _this.pageSize, (_this.pageIndex-1) * _this.pageSize)),
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
//表单项内容发生改变
handleInputChange(event) {
  this.setData({
    searchContent: event.detail.value.trim()
  })
  if(isSend){
    return;
  }
  isSend = true;
  
  //发请求获取搜索匹配到的数据
  // this.getSearchListData();

  //函数节流
  setTimeout(() => {
    isSend = false;
  }, 500);
},
//清空搜索内容
handleClear(){
  this.setData({
    searchContent: '',
    // searchList: []
  })
},
//tab栏切换
onChange(event) {
  console.log(event)
  wx.pageScrollTo({
    scrollTop: 0,
    duration: 300
  });
  wx.showToast({
    title: `切换到标签 ${event.detail.name}`,
    icon: 'none',
  });
  this.setData({
    active:event.detail.index,
    listShowType: 1,
    finished: false,
    // listData: [],
  });
  console.log(this.data.active)
  //请求列表接口
},
  // 得到积分记录列表
  // getListFn() {
  //   let that = this;
  //   let _this = this.data;
  //   getintegralrecordlist(_this.integralData).then(res => {
  //     if (res.code == 200) {
  //       let listData = res.response.data;
  //       that.setData({ total: res.response.total });
        
  //       // 将新请求到的数据添加到之前的数据后
  //       if (_this.page_index == 1) {
  //         that.setData({
  //           listData: res.response.data,
  //           finished: false
  //         }); // 数据未加载完成
  //         wx.stopPullDownRefresh(); // 停止下拉动作
  //       } else {
  //         that.setData({
  //           listData: _this.listData.concat(listData)
  //         });
  //       }
  //       //  分页判断
  //       if (
  //         _this.total / _this.integralData.page_size >
  //         _this.integralData.page_index
  //       ) {
  //         that.setData({ 'integralData.page_index': _this.integralData.page_index + 1 });
  //       } else {
  //         that.setData({ finished: true }); // 数据全部加载完成
  //       }
  //       setTimeout(function () {
  //         that.setData({
  //           listShowType: _this.total ? 1 : 2,
  //           loading: false
  //         });
  //         // _this.loading = false; // 加载状态结束
  //       }, 300);
  //     } else {
  //       return that.setData({
  //         listShowType: 3,
  //         msgText: res.msg
  //       });
  //     }
  //   });
  // },
  // getNoticeFn() {
  //   let that = this;
  //   let _this = this.data;
  //   getnoticelist({
  //     store_id: wx.getStorageSync("ext").store_id,
  //     is_failure: _this.active,
  //     page_index: _this.pageIndex,
  //     page_size: _this.pageSize
  //   }).then(res => {
  //     if (res.code != 200) {
  //       return that.setData({
  //         listShowType: 3,
  //         msgText: res.msg
  //       });
  //     }
  //     let noticeArr = res.response.data;
  //     that.setData({ total: res.response.total });
  //     //  分页判断
  //     if (_this.total / _this.pageSize > _this.pageIndex) {
  //       that.setData({ pageIndex: _this.pageIndex + 1 });
  //     } else {
  //       that.setData({ finished: true }); // 数据全部加载完成
  //     }
  //     // 将新请求到的数据添加到之前的数据后
  //     that.setData({
  //       noticeArr: _this.noticeArr.concat(noticeArr)
  //     });
  //     setTimeout(function () {
  //       that.setData({ listShowType: _this.total ? 1 : 2 });
  //     }, 300);
  //   });
  // },
  // loadmore(){
  //   //加载提示
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   var that = this;
  //   console.log(that.data.pagesCount,that.data.page)
  //   if(that.data.pagesCount>that.data.page){
  //     that.setData({
  //       newList:that.data.newList.concat(that.data.dataList.slice((that.data.page-1) * that.data.n, (that.data.page) * that.data.n)),
  //       page: ++that.data.page,
  //     })
  //     console.log(that.data.pagesCount,that.data.page)
  //   }else{
  //     console.log('---')
  //     that.setData({
  //       newList:that.data.dataList,
  //       loading:false,
  //       // dataList:[]
  //     })
  //        wx.showToast({
  //       title: '没有更多数据了',
  //     })
  //   }
  //   wx.hideLoading();
  // },

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