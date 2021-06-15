
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectShow: false,//控制期刊年的下拉列表的显示隐藏
    maName:'',//默认第几年
    yearOption: [],//杂志年份数组
    selectOption:false,//控制期刊的下拉列表的显示隐藏
    timeOption: [],//杂志期刊数组
    timeName:'',//默认第几期
    yearValue: 0,//默认年
    timeValue:0,//默认期
    currentIndex: 0,//当前轮播图
    propData:[{
      event_value:1,
      event_type:1,
      images_url:'https://www.chinamas.cn/upload/2021/01/21/16112001614973.jpg'
    },
    {
      event_value:2,
      event_type:2,
      images_url:'https://www.chinamas.cn/upload/2021/04/10/16180699079770.jpg'
    }
  ,{
    event_value:3,
    event_type:3,
    images_url:'https://www.chinamas.cn/upload/2021/02/25/16142195292642.jpg'
  }
    ],
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
        img:"http://img.deiyou.net/upload/seller/goods/image/2019/9/25/061b559c523a4fd6992545d33410caaf",
        title:"音频标题标题标题标题标题标题标题标题",
        num:2,
        author:'作者姓名',
        isBalloon:false,//是否展示操作框
      },
      {
        id:3,
        img:"https://march.yuanian.com/static/assets/img/none.png",
        title:"音频标题标题标题标题标题标题标题标题",
        num:2,
        author:'作者姓名',
        isBalloon:false,//是否展示操作框
      }
      ,{
        id:4,
        img:"http://img.deiyou.net/upload/seller/goods/image/2019/9/25/061b559c523a4fd6992545d33410caaf",
        title:"音频标题标题标题标题标题标题标题标题",
        num:2,
        author:'作者姓名',
        isBalloon:false,//是否展示操作框
      },
      {
        id:5,
        img:"http://img.deiyou.net/upload/seller/goods/image/2019/9/25/061b559c523a4fd6992545d33410caaf",
        title:"音频标题标题标题标题标题标题标题标题",
        num:2,
        author:'作者姓名',
        isBalloon:false,//是否展示操作框
      }
    ], //列表数组
    magazineData:{},//期刊列表
    total: 0, //列表总条数
    pageSize: 10,//每页个数
    pageIndex: 1,//当前也
    listShowType: 0, // 列表显示状态 0加载中 1有 2无
    finished: false,//是否加载完毕
    AllData:[],//总数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //杂志音频列表
    this.maWalkListFn();
  },
  // 年点击下拉显示框
  selectTap() {
    this.setData({
      selectShow: !this.data.selectShow
    });
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      maName: name,
      selectShow: false
    })
    if (this.data.magazineData.hasOwnProperty(name))
      this.setData({
        timeOption:this.data.magazineData[name]
      })
  },
  // 期刊点击下拉显示框
  selectOption() {
    this.setData({
      selectShow:false,
      selectOption: !this.data.selectOption
    });
  },
  optionSelect(e) {
    let mId=e.currentTarget.dataset.id;
    this.setData({
      timeName: e.currentTarget.dataset.name,
      selectOption: false,
      listShowType:0,
      AllData:[]
    })
    this.getMagazineAudioFn(mId)
  },
  //切换轮播图
  changeSwiper: function (e) {
    this.setData({
    currentIndex: e.detail.current
    })
  },
  //杂志音频列表
  maWalkListFn(){
    let that = this;
    getApp().globalData.api.maWalkList({
    }).then(res=>{
      console.log(res)
      if(res.bol==true){
        that.setData({
          // propData:res.data.adver,
          yearOption:Object.keys(res.data.magazine),
          magazineData:res.data.magazine,
          AllData:res.data.list,
          total:res.data.list.length,
        });
        for (let key in res.data.magazine) {
          this.setData({
            timeOption:res.data.magazine[key]
          })
        }
        this.loadmore();
      }else{
        wx.showToast({ title: res.data.msg, icon: "none" });
      }
    })
  },
  // 获取杂志下所有音频
  getMagazineAudioFn(mId){
    let that = this;
    getApp().globalData.api.getMagazineAudio({
      m_id:mId
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
  //点击操作
  onEdit(e) {
    let item = e.currentTarget.dataset.id;
    let idx=e.currentTarget.dataset.idx;
    console.log(item,idx)
    // this.data.listData.forEach((item, i) => {
    //   item.isBalloon = idx == i? true: false
    // })
    if(this.data.listData[idx].isBalloon){
      this.data.listData[idx].isBalloon = !this.data.listData[idx].isBalloon
    }else{
      this.data.listData.forEach((item, i) => {
        item.isBalloon = idx == i? true: false
      })
    }
   
    this.setData({
      listData:this.data.listData
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
    // if (!this.data.finished) this.loadmore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})