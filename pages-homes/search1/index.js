import regeneratorRuntime from "../../libs/regenerator/runtime-module";
let isSend = false;//函数节流使用
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchContent: '',//表单项内容
    hotList:['数智化经营','财务管理'],//热门搜索数组
    listData: [
      // {
      //   id:1,
      //   img:"http://img.deiyou.net/upload/seller/goods/image/2019/9/25/061b559c523a4fd6992545d33410caaf",
      //   title:"音频标题标题标题标题标题标题标题标题",
      //   num:2,
      //   author:'作者姓名',
      //   isBalloon:false,//是否展示操作框
      // },
    ], //推荐列表数组
    searchList: [],//匹配到的数据
    pageIndex: 1,
    pageSize: 10,
    total: 0, //列表总条数
    listShowType: 0, // 列表显示状态 0加载中 1有 2无
    AllData:[],
    isSearch:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //获取初始化数据
      this.getInitData();
  },
    //获取初始化数据
    async getInitData(){
      let hotListData =  await getApp().globalData.api.searchVocabularyList({});
      if(hotListData.bol){
        this.setData({
          hotList: hotListData.data.vocabulary,
          listData:hotListData.data.recommend
        })
      }else{
        wx.showToast({
          title: hostListData.err_msg,
          icon: "none"
        });
      }
    },
   //表单项内容发生改变
   handleInputChange(event){
    this.setData({
      searchContent: event.detail.value.trim()
    })
    if(isSend){
      return;
    }
    isSend = true;
    //发请求获取搜索匹配到的数据
    this.getSearchListData();

    //函数节流
    setTimeout(() => {
      isSend = false;
    }, 500);
  },

  //发请求获取搜索匹配到的数据
  async getSearchListData(){
    //当搜索内容为空时就不发送请求并清空内容
    if(!this.data.searchContent){
      this.setData({
        searchList: []
      })
      return;
    }

    let {searchContent} = this.data;

    let searchListData = await getApp().globalData.api.searchList({
      content:searchContent
    });
    this.setData({
      AllData: searchListData.data,
      total:searchListData.data.length,
      isSearch:true
    })
    this.loadmore();
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
        searchList:_this.searchList.concat(_this.AllData.slice((_this.pageIndex-1) * _this.pageSize, (_this.pageIndex-1) * _this.pageSize)),
        pageIndex: _this.pageIndex + 1 ,
      })
    }else{
      that.setData({
        searchList:_this.AllData,
        finished: true,// 数据全部加载完成
      })
    }
    setTimeout(function () {
      that.setData({ listShowType: _this.total ? 1 : 2 });
    }, 300);
    wx.hideLoading();
  },
  //清空搜索内容
  handleClear(){
    this.setData({
      searchContent: '',
      searchList: [],
      isSearch:false
    })
    console.log(this.data.searchContent,'清除-----')
  },
  //点击热搜榜进行搜索
  searchHot(event){
    this.setData({
      searchContent: event.currentTarget.dataset.hotword
    })

    //发请求获取搜索匹配到的数据
    this.getSearchListData();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})