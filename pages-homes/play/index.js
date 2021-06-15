// pages-homes/play/index.js
// let musiclist=[]
// //正在播放歌曲的index
// let nowPlayingIndex=0
//获取全局唯一的背景音频管理器
const backgroundAudioManager=wx.getBackgroundAudioManager()
import regeneratorRuntime from "../../libs/regenerator/runtime-module";
//获取全局实例
const appInstance = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,//false表示不播放，true播放
    musicId:1,//播放id
    currentIndex:0,//当前索引
    isMusicLink:false,//是否是第一次播放
    playData:{
        src: 'https://cmas-lis.oss-cn-hangzhou.aliyuncs.com/c5fc19c8df334bea8ae6d952fa0c311c/TRANSCODE_1620640654182/%E6%BA%AF%20%28Reverse%E6%B2%BB%E6%84%88%E7%89%88%29',
        poster: 'https://616e-anilagle-7474cd-1256663410.tcb.qcloud.la/logo部分的补充图/4.JPG?sign=62938ddecd979722c6726c100d8119fb&t=1547648207',
        name: '安河桥',
        author: '韩铭'
    },
    duration: 0,
    progress: 0,
    progressText: "00:00",//实时时间
    durationText: "00:00",//总时长
    payShow : false,//单篇付费弹框
    menuShow:false,//播单列表弹框
    currentTabs:0,//0当前播放 1 播放历史
    vipShow:false,//是否展示付费弹框
    // status播放状态 0未播放1播放中2已播完
    menuData:[
      // {musicId:1,name:'第15章   《管理会计研究》第一期_015',status:0},
    ],//当前播放列表
    isInverted:false,//是否倒序
    historyData:[
      { id:1,
        name:'《管理会计研究》 杂志第一期',
        sub:'第21章  《管理会计研究》第一期_021',
        duration:'10:00',
        progress:'10%',
        author:'作者姓名'
      },
    ],//最近收听数据
    listShowType: 1, // 列表显示状态 0加载中 1有 2无
    userInfo:'',//用户信息
    isCollect:false,//是否收藏
    payData: {}, // 支付配置参数
    isStatus:true,//是否展示单篇付费弹框
    isShare:false,//是否是从分享页进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'---')
      //options路由跳转参数
      let musicId = options.mwaId;
      let userInfo = wx.getStorageSync("userInfo");
      this.setData({
        musicId:musicId,
        userInfo: userInfo,
        isShare:options.isShare
      });
     this.menuListFn();//播单列表
    //判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      console.log(appInstance.globalData.musicId)
      //修改当前页面音乐播放状态
      this.setData({
        isPlay: true
      })
    }
    if(this.data.isShare=='true'){
      if(!userInfo){
        return wx.reLaunch({ url: `/pages/index/index?pagePlay=${this.data.musicId}`})
      }
    }else{
      //自动播放当前音乐
      this.myrecord()
      
    }
    //监视音乐播放与暂停
    backgroundAudioManager.onPlay(()=>{
      console.log('onplay')
      //修改音乐播放状态
      this.changePlayState(true);
      appInstance.globalData.musicId = musicId;
      // this.countTimeDown(this,backgroundAudioManager);
    });
    backgroundAudioManager.onPause(()=>{
      console.log('onPause')
      this.changePlayState(false);
      this.listeningFn();
      console.log(this.data.progress,this.data.duration,'-----')
    });
    backgroundAudioManager.onStop(()=>{
      this.listeningFn();
      this.changePlayState(false);
    });
    //音乐播放自然结束
    backgroundAudioManager.onEnded(()=>{
      console.log("onend")
        this.listeningFn();
        this.setData({
          isPlay: false
        })
        if(this.data.isStatus){
          this.setData({
            payShow:true
          })
        }else{
          this.nextMusic();
        }
    })
    //监听音乐实时播放的进度
    backgroundAudioManager.onTimeUpdate(() => {
        this.setData({
          progress: Math.ceil(backgroundAudioManager.currentTime),
          progressText: this.formatTime(Math.ceil(backgroundAudioManager.currentTime)),
          duration: Math.ceil(backgroundAudioManager.duration),
          durationText: this.formatTime(Math.ceil(backgroundAudioManager.duration)),
          isMusicLink:true
        })
    })
  },
  myrecord(){
    let myrecord = wx.getStorageSync("record")
    console.log(myrecord,'myrecord----')
    if (myrecord != "") {
      if (myrecord.musicId == this.data.musicId) {
        console.log(this.data.musicId,myrecord.musicId,)
        backgroundAudioManager.pause();
        backgroundAudioManager.seek(myrecord.progress);
      this.setData({
        progressText: this.formatTime(Math.ceil(myrecord.progress))
      })
      setTimeout(function () {
        backgroundAudioManager.play();
      }, 1000);
      this.setData({
        currentIndex: myrecord.currentIndex,
      })
      wx.setStorageSync("record", "")
      }else{
        this.musicControl(true,this.data.musicId);
      }
    }else{
      this.musicControl(true,this.data.musicId);
    }
  },
  //获取播放时长传给后台
  async listeningFn(){
    let that = this;
    let {duration,progress}=that.data;
    console.log(that.data.progress,that.data.duration,'监听')
    let res=await getApp().globalData.api.listening({
      uid:wx.getStorageSync("userInfo").uid,
      auid:that.data.musicId,
      total_time:duration,
      heard_time:progress
     })
  },
  //点击播放列表每一项
  onSelect(event){
    //关闭当前播放音乐
    backgroundAudioManager.stop();
    let musicId=event.currentTarget.dataset.musicid
    let index=event.currentTarget.dataset.index
    this.setData({
      musicId:musicId,
      currentIndex:index
    })
    //  //自动播放当前音乐
    this.musicControl(true,musicId);
    // this.menuListFn();
  },
  //修改播放状态
  changePlayState(isPlay){
    this.setData({
      isPlay: isPlay
    })
    //修改全局播放状态
    appInstance.globalData.isMusicPlay = isPlay;
  },
  //点击暂停/播放的回调
  handleMusicPlay(){
    //修改是否播放的状态
    let isPlay = !this.data.isPlay;
    let {musicId,isMusicLink} = this.data;
    this.musicControl(isPlay,musicId,isMusicLink);
  },
  //歌曲播放控制功能
  async musicControl(isPlay,musicId,isMusicLink){
    let that = this;
    if(isPlay){//音乐播放
      if(isMusicLink){
        backgroundAudioManager.play();
      }else{
        //音频详情
          let response=await getApp().globalData.api.contentDesc({
            uid:wx.getStorageSync("userInfo").uid,
            audId:musicId
          })
            if(response.bol==true){
              let {isStatus,isCollect}=that.data;
              if(response.data.desc.is_collections=="未收藏"){
                isCollect=false
              }else{
                isCollect=true
              }
              if(response.data.desc.status!=="付费"){
                isCollect=false
              }
              that.setData({
                playData:response.data.desc,
                isCollect,
                isStatus
              });
            }else{
              wx.showToast({ title: response.data.msg, icon: "none" });
          }
          //歌曲播放
          backgroundAudioManager.title = this.data.playData.mwa_title
          backgroundAudioManager.epname = this.data.playData.mwc_title
          backgroundAudioManager.singer = this.data.playData.mwa_author
          // backgroundAudioManager.coverImgUrl = this.data.playData.poster
          // 设置了 src 之后会自动播放
          backgroundAudioManager.src = this.data.playData.url
      }
    }else{//音乐暂停
      backgroundAudioManager.pause();
    }
  },

  //上一首
  lastMusic: function () {
    //关闭当前播放音乐
    backgroundAudioManager.stop();
    let currentIndex = this.data.currentIndex > 0 ? this.data.currentIndex - 1  :  this.data.menuData.length - 1;
    this.setData({
      currentIndex: currentIndex,
      duration:0,
      progress: 0,
      progressText: "00:00",
      durationText: "00:00"
    })
    let musicId = this.data.menuData[currentIndex].mwa_id;
    //自动播放当前音乐
    setTimeout(function () {
      this.musicControl(true,musicId);
    }.bind(this), 100);
  },
  //下一首
  nextMusic: function () {
    //关闭当前播放音乐
    backgroundAudioManager.stop();
    let currentIndex = this.data.currentIndex < this.data.menuData.length - 1 ? this.data.currentIndex + 1 : 0;
    this.setData({
      currentIndex: currentIndex, //更新下标
      duration:0,
      progress: 0,
      progressText: "00:00",
      durationText: "00:00"
    })
    let musicId = this.data.menuData[currentIndex].mwa_id;
    //自动播放当前音乐
    setTimeout(function () {
      this.musicControl(true,musicId);
    }.bind(this), 100);
  },
  //循环计时
  countTimeDown(that,backgroundAudioManager) {
    if (that.data.isPlay) {
      that.setData({
        progress: Math.ceil(backgroundAudioManager.currentTime),
        progressText: that.formatTime(Math.ceil(backgroundAudioManager.currentTime)),
        duration: Math.ceil(backgroundAudioManager.duration),
        durationText: that.formatTime(Math.ceil(backgroundAudioManager.duration))
      })
      setTimeout(function(){
        that.countTimeDown(that,backgroundAudioManager);
      },1000)
    }
  },
  //拖动事件
  sliderChange: function (e) {
    backgroundAudioManager.pause();
    backgroundAudioManager.seek(e.detail.value);
    this.setData({
      progressText: this.formatTime(e.detail.value)
    })
    backgroundAudioManager.play();
  },
  //格式化时长
  formatTime: function (s) {
    let t = '';
    s = Math.floor(s);
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
    
  },
  //付费弹框点击取消按钮
  onClose() {
    console.log(this.data.duration,'----')
    this.setData({ 
      payShow: false,
    });
    this.musicControl(true,this.data.musicId);
  },
  //点击播单按钮
  onMenuList(){
    this.setData({ menuShow: !this.data.menuShow });
  },
  //播单弹框取消事件
  onCloseMenu(){
    this.setData({ menuShow: false });
  },
  //切换播单弹框tabs栏
  onTabs:function(event){
    let index = event.currentTarget.dataset.id;
    this.setData({
      currentTabs:index
    })
    if(index==0){
      this.menuListFn();
    }else if(index==1){
      this.recentListeningFn();
    }
  },
  //支付弹框关闭
  vipShowClose(e){
    this.setData({
      vipShow:e.detail.vipShow
    })
  },
  //正序
  just() {
    var achearr = this.data.menuData;
    if (achearr[0].musicId == 1) {
      wx.showToast({
        title: '已是正序',
        icon: 'none',
        image: '',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      var bchearr = achearr.reverse();
      this.setData({
        menuData: bchearr,
        isInverted:false
      })
    }
  },
  //倒序
  back() {
    var achearr = this.data.menuData;
    if (achearr[0].musicId != 1) {
      wx.showToast({
        title: '已是倒序',
        icon: 'none',
        image: '',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      var bchearr = achearr.reverse();
      this.setData({
        menuData: bchearr,
        isInverted:true
      })
    }
  },
  //点击开通会员
  onVipShow(){
    this.setData({
      menuShow:false,
      vipShow:true,
    })
  },
  //从单篇点击开通会员
  vipShowFn(){
    this.setData({
      payShow:false,
      vipShow:true,
    })
  },
  //获取播单数据
  menuListFn(){
    let that = this;
    getApp().globalData.api.menuList({
      auid:this.data.musicId
    }).then(res=>{
      if(res.bol==true){
        let {currentIndex}=this.data
        for (let i in res.data) {
          if (res.data[i] == this.data.musicId) {
            currentIndex=i
          }
        }
        that.setData({
          menuData:res.data,
          currentIndex:currentIndex
        });
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
      if(res.bol==true){
        that.setData({
          historyData:res.data,
          listShowType: res.data.length>0 ? 1 : 2 
        });
      }else{
        wx.showToast({ title: res.data.msg, icon: "none" });
      }
    })
  },
  //点击收藏图标
  collectFn(){
    let that = this;
    if(!that.data.isCollect){
      getApp().globalData.api.collectionAdd({
        uid:wx.getStorageSync('userInfo').uid,
        auid:this.data.musicId
      }).then(res=>{
        if(res.bol){
          wx.showToast({ title: res.data.msg, icon: "none" });
          that.setData({
            isCollect:true
          });
        }else{
          wx.showToast({ title: res.data.msg, icon: "none" });
        }
      })
    }else{
      // wx.showToast({ title: "您已经收藏了", icon: "none" });
      this.cancelCollectionFn();
    }
  },
  //取消收藏 
  cancelCollectionFn(){
    let that=this;
    getApp().globalData.api.cancelCollection({
      uid:wx.getStorageSync('userInfo').uid,
      coll_id:this.data.musicId
    }).then(res=>{
      if(res.bol){
        wx.showToast({ title: res.data.msg, icon: "none" });
        that.setData({
          isCollect:false
        });
        console.log(that.data.isCollect)
      }else{
        wx.showToast({ title: res.data.msg, icon: "none" });
      }
    })
  },
  //单篇支付
  singlePay(){
    let that=this;
     // 请求接口获取唤醒支付的参数
     getApp()
     .globalData.api.walkPay({
        type:1,//单篇购买音频 1 VIP购买 2
        uid:wx.getStorageSync('userInfo').uid,
        auid:that.data.musicId
      })
      .then(res => {
        // 得到支付需要的参数信息
        that.setData({ payData: res});
        // 唤起支付弹框
        that.arousePayFn();
      });
  },
  // 唤起支付弹框
  arousePayFn() {
    let that = this;
    let payData = that.data.payData;
    wx.requestPayment({
      timeStamp: payData.timeStamp.toString(),
      nonceStr: payData.nonceStr,
      package: payData.package,
      signType: payData.signType,
      paySign: payData.sign,
      success(res) {
        that.setData({
          payShow:false,
        })
        //请求判断是不是会员接口
        that.nextMusic()
        //  that.triggerEvent('vipShowClose',{ vipShow: false } )
      },
      fail(res) {
        wx.showToast({ title: "支付失败,请求重试", icon: "none" });
      },
      complete(res) {
      }
    });
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
    let currentIndex= this.data.currentIndex
    let progress = this.data.progress
    let progressText = this.data.progressText
    let duration = this.data.duration
    let durationText = this.data.durationText
    let musicId = this.data.musicId
    let record = new Object()
    record.currentIndex = currentIndex
    record.musicId = musicId
    record.progress = progress
    record.progressText = progressText
    record.duration = duration
    record.durationText = durationText
    wx.setStorageSync("record", record)
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
  onShareAppMessage: function (options) {
    let _this = this.data;
    if (options.from === 'button') {
      return {
        title: _this.playData.mwc_title,
        path:`/pages-homes/play/index?isShare=true&mwaId=${_this.musicId}`,
      }
    }
    // return {
    //   title:'分享',
    // &uid=${wx.getStorageSync('userInfo').uid}
    //   // title: _this.goodsinfo.share_title ?
    //   //   _this.goodsinfo.share_title : _this.salesmanData.title,
    //   // path: `/pages/goods/integral/index?id=${
    //   //   _this.salesmanData.goodsId
    //   //   }&activityid=${_this.salesmanData.activityId}`, //这里拼接需要携带的参数
    //   // imageUrl: _this.goodsinfo.cover ?
    //   //   _this.goodsinfo.cover : _this.salesmanData.cover
    // };
  // if (options.from === 'button') {
  //   // 来自页面内转发按钮
  // }
  // let uid=wx.getStorageSync("userInfoData").uid
  // console.log(uid,'0000000000000')
  // return {
  //   title: "PLUS会员团购",
  //   path:`/pages/course/plus-group/index?plusId=1&teamId=${that.data.teamId}`
  //   // path:`/pages/course/plus-group/index?plusId=1&uid=${wx.getStorageSync('userInfoData').uid}`
  // };
  },
    /**
   * 分享朋友圈 onShareTimeline
   */
  // onShareTimeline() {
  //   let _this = this.data;
  //   return {
  //     title:'分享',
  //     // title: _this.shareStoreInfo.share_title == '标题' ? app.globalData.store.name : _this.shareStoreInfo.share_title,
  //     // query: `invitecode=${_this.salesmanData.code}&extObj=${JSON.stringify(app.globalData.ext)}`, //这里拼接需要携带的参数
  //     // imageUrl: _this.shareStoreInfo.picture_list.length > 0 ? _this.shareStoreInfo.picture_list[0] : app.globalData.store.logo,
  //   };
  // }
})
