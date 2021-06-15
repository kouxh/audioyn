// pages-homes/playing/index.js
import regeneratorRuntime from "../../libs/regenerator/runtime-module";
//获取全局唯一的背景音频管理器
const backgroundAudioManager=wx.getBackgroundAudioManager()
//获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    isPlay:false,//false表示不播放，true播放
    musicId: 1,//歌曲Id
    index:0,
    recommendList:[],
    playData:{
        src: 'https://cmas-lis.oss-cn-hangzhou.aliyuncs.com/Still%20Doll.mp3',
        poster: 'https://616e-anilagle-7474cd-1256663410.tcb.qcloud.la/logo部分的补充图/4.JPG?sign=62938ddecd979722c6726c100d8119fb&t=1547648207',
        name: '安河桥',
        author: '韩铭'
    },
    musicLink:'',
    duration: 0,
    progress: 0,
    progressText: "00:00",//实时时间
    durationText: "00:00",//总时长
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //接受传过来的musicId
    //options路由跳转参数
    // let musicId = options.song;
    // this.setData({
    //   musicId: musicId
    // })
    // this.getMusicInfo(musicId);
    let {musicId}=this.data
    console.log(musicId)
    //判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      console.log(appInstance.globalData.musicId)
      //修改当前页面音乐播放状态
      this.setData({
        isPlay: true
      })
    }
    // this.musicControl(this.data.isPlay,musicId);
     //自动播放当前音乐
    //  this.musicControl(true,musicId);
    //监视音乐播放与暂停
    backgroundAudioManager.onPlay(()=>{
      console.log('onplay')
      //修改音乐播放状态
      this.changePlayState(true);
      appInstance.globalData.musicId = musicId;
      let that = this;
      // this.countTimeDown(that,backgroundAudioManager);
    });
    backgroundAudioManager.onPause(()=>{
      console.log('onPause')
      this.changePlayState(false);
    });
    backgroundAudioManager.onStop(()=>{
      this.changePlayState(false);
    });
    //音乐播放自然结束
    backgroundAudioManager.onEnded(()=>{
      //切歌
      // PubSub.publish('switchMusic','next');
      // this.setData({
      //   currentWidth: 0,
      //   currentTime: '00:00',
      //   lyric: [],
      //   lyricTime: 0,
      // })
      // setTimeout(function () {
      //   that.nextMusic();
      // }, 1500);
    })
    //监听音乐实时播放的进度
    backgroundAudioManager.onTimeUpdate(() => {
      //获取歌词对应时间
      // let lyricTime = Math.ceil(this.backgroundAudioManager.currentTime); 
      // let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
      // let currentWidth = (this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration) * 450;
      this.setData({
        progress: Math.ceil(backgroundAudioManager.currentTime),
        progressText: this.formatTime(Math.ceil(backgroundAudioManager.currentTime)),
        duration: Math.ceil(backgroundAudioManager.duration),
        durationText: this.formatTime(Math.ceil(backgroundAudioManager.duration)),
        // percent : backgroundAudioManager.currentTime/backgroundAudioManager.duration*100

      })

    })
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
    // this.setData({
    //   isPlay: isPlay
    // })
    let {musicId,musicLink} = this.data;
    this.musicControl(isPlay,musicId,musicLink);
  },
   //歌曲播放控制功能
   async musicControl(isPlay,musicId,musicLink){
    if(isPlay){//音乐播放
      if(!musicLink){
        //获取音乐播放链接
        //获取音频资源
      // let musicLinkData = await request('/song/url',{id: musicId})
      // let musicLink = musicLinkData.data[0].url;
      // this.setDate({
      //   musicLink
      // })
      }
      
      // if(musicLink === null){
      //   wx.showToast({
      //     title: '请开通会员后听取',
      //     icon: 'none'
      //   })
      //   return;
      // }
      //歌曲播放
      backgroundAudioManager.title = this.data.playData.name
      backgroundAudioManager.epname = this.data.playData.name
      backgroundAudioManager.singer = this.data.playData.author
      backgroundAudioManager.coverImgUrl = this.data.playData.poster
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = this.data.playData.src
      console.log(this.formatTime(Math.ceil(backgroundAudioManager.duration)))
      
    }else{//音乐暂停
      backgroundAudioManager.pause();
    }
  },
   //歌曲切换
  //  handleSwitch(event){
  //   //切换类型
  //   let type = event.currentTarget.id;

  //   //关闭当前播放音乐
  //   backgroundAudioManager.stop();
  //   let {recommendList,index} = this.data;
  //   if(type === 'pre'){//上一首
  //     (index === 0) && (index = recommendList.length);
  //     index -= 1;
  //   }else{//下一首
  //     (index === recommendList.length - 1) && (index = -1);
  //     index += 1;
  //   }

  //   //更新下标
  //   this.setData({
  //     index: index
  //   })

  //   let musicId = recommendList[index].id;
  //    //获取歌曲
  //    this.getMusicInfo(musicId);
  //    //自动播放当前音乐
  //    this.musicControl(true,musicId);

  //   //订阅来自recommendSong页面
  //   // PubSub.subscribe('musicId',(msg,musicId) => {
  //   //   //获取歌曲
  //   //   this.getMusicInfo(musicId);
  //   //   //自动播放当前音乐
  //   //   this.musicControl(true,musicId);
  //   //   //取消订阅
  //   //   PubSub.unsubscribe('musicId');
  //   // })
  //   // //发布消息数据给recommendSong页面
  //   // PubSub.publish('switchMusic',type);
  // },
   //循环计时
   countTimeDown: function (that,backgroundAudioManager) {
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
    console.log(e)
    // let manager = wx.getBackgroundAudioManager();
    backgroundAudioManager.pause();
    backgroundAudioManager.seek(e.detail.value);
    this.setData({
      progressText: this.formatTime(e.detail.value)
    })
    setTimeout(function () {
      backgroundAudioManager.play();
    }, 1000);
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