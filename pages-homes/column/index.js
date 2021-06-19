// pages-homes/column/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    columnId:'1',//栏目id
    listData: [
      {
        id:1,
        img:"https://march.yuanian.com/static/assets/img/none.png",
        title:"音频标题标题标题标题标题标题标题标题",
        num:2,
        author:'作者姓名',
        isBalloon:false,//是否展示操作框
      },
   
    ], //列表数组
    AllData:[],//总数组
    pageIndex: 1,
    pageSize: 10,
    total: 0, //列表总条数
    listShowType: 1, // 列表显示状态 0加载中 1有 2无
    finished: false,//数据是否加载完成
    columnName:"",//栏目名
    active: 0,//0全部 1 推荐
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      columnId:options.mwc_id,
      columnName:options.mwc_title
    })
    //数据列表
    this.columnListFn();
  },
  //点击tabs栏切换
  onChange(event) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
    this.setData({
      active:event.detail.index,
      listShowType: 0,
      finished: false,
      listData: [],
    });
    if(event.detail.index==1){
      this.columnListFn(1);
    }else{
      this.columnListFn();
    }
    
  },
 //跳转到搜索页面
 toSearch(){
  wx.navigateTo({
    url: '/pages-homes/search1/index',
  })
},
  //数据列表
  columnListFn(num){
  let that = this;
  getApp().globalData.api.columnList({
    column_id:that.data.columnId,
    recommend:num
  }).then(res=>{
    if(res.bol==true){
      that.setData({
        AllData:res.data.list,
        total:res.data.list.length
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