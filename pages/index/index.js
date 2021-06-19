// index.js
import regeneratorRuntime from "../../libs/regenerator/runtime-module";
import account from "../../api/loginCode.js";
Page({
  data: {
    userInfo: '',
    hasBindMobile:false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false, // 如需尝试获取用户信息可改为wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') 
    encryptedInfo:'',
    ivInfo:'',
    phoneShow: true,
    pagePlay:'',//分享标识
    code:""
  },
  onLoad(options) {
    console.log(options,'-----')
    this.setData({
      pagePlay: options.pagePlay,
    })
      //获取用户本地是否是第一次进入新版本
      let hasBindMobile = wx.getStorageSync('hasBindMobile');
      let userInfo=wx.getStorageSync('userInfo');
      if(hasBindMobile&&userInfo){
        wx.switchTab({
          url: "/pages/home/index"
        })
      }
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true,
      })
    }
  },
  onClose() {
    this.setData({ 
      phoneShow: false,
      hasBindMobile:false,
      userInfo:''
     });

  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.showToast({
          title: '授权成功',
          icon: 'success',
          duration: 1000
        })
        setTimeout(() => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            hasBindMobile:true,
            phoneShow: true,
            encryptedInfo:res.encryptedData,//用户授权的加密数据
            ivInfo: res.iv,//用户授权的iv
          })
        }, 1000);
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e,'2')
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      hasBindMobile:true,
    })
  },
   // 手机号授权
   async getPhoneNumber (e) {
    // var resCode = await account.getWxCode();
    let that = this;
    if (e.detail.encryptedData) {
          var datas = {
            code:that.data.code,
            encryptedDataInfo: that.data.encryptedInfo,
            ivInfo: that.data.ivInfo,
            encryptedDataPhone: e.detail.encryptedData,
            ivPhone: e.detail.iv,
            type:3
          };
          var jsonStr = JSON.stringify(datas)
          wx.showLoading({
            title: "登录中...",
            mask: true
          });
          // 小程序授权绑定手机号接口成功之后弹框消失
          getApp()
            .globalData.api.login({json:jsonStr})
            .then(res1 => {
              if(!res1.bol){
                wx.showToast({ title: "绑定失败",icon: "none"});
              }else{
                wx.showToast({title: '登录成功',icon: 'success',duration: 2000});
                this.setData({
                  phoneShow:false
                })
                wx.setStorageSync('hasBindMobile', true)
                wx.setStorageSync('userInfo', res1.data)
                wx.hideLoading();
                console.log(res1.data,"登录成功")
                if(that.data.pagePlay){
                  wx.reLaunch({
                    url: `/pages-homes/play/index?mwaId=${that.data.pagePlay}`,
                  })
                }else{
                  wx.switchTab({
                    url: '/pages/home/index'
                  }) 
                }
               
              }
            });
    } else {
      //用户点击拒绝
      wx.showModal({
        title:'警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
         if (res.confirm) {
             console.log('用户点击了“返回授权”');
         }
     }

      })
    }
    
  },
   /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
     //登录态刷新
     wx.login({
      success(res) {
        if(res.code){
          that.setData({
            code:res.code
          })
        }
      }
    })
  }
})
