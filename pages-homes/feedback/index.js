// pages-homes/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:'',
    fileList: [],
    submitBool: true, // 是否允许再次点击
    imgUrl:'',
    problemBool:false,//问题反馈弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //图片上传
  afterRead(event) {
    let that =this;
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://www.chinamas.cn/laravelUploadImg', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        var result=JSON.parse(res.data)
        console.log(result)
        const { fileList = [] } = that.data;
        fileList.push({ ...file, url: res.data });
        that.setData({ fileList });
        that.setData({ imgUrl:result.data.src });
      },
    });
  },
   // 删除图片
  delete(event) {
     let imgDelIndex = event.detail.index
     let fileList = this.data.fileList
     fileList.splice(imgDelIndex,1)
     this.setData({
       fileList
     })
  },
 
  
  // 评论内容 同步
  textAreaValue(e) {
    this.setData({
      content: e.detail.value,
    })
    console.log(this.data.content)
  },
   // 提交意见反馈
   commentFn() {
    let that = this;
    if(that.data.content==''){
      return wx.showToast({ title: "请输入反馈内容", icon: "none" });
    }
    that.setData({ submitBool: false })
    getApp().globalData.api.opinionBack({
      content: that.data.content,
      uid:wx.getStorageSync('userInfo').uid,
      imgUrl:that.data.imgUrl
    }).then(res => {
      if (res.bol) {
        that.setData({ problemBool:true })
        // wx.showToast({ title: res.data.msg, icon: 'none' })
      } else {
        wx.showToast({ title: res.data.msg, icon: 'none' })
      }
    })
    that.setData({ submitBool: true })
  },
   //问题反馈弹框
   problemClose(e){
    this.setData({
      problemBool:e.detail.problemShow
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})