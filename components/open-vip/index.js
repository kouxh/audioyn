// components/open-vip/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    vipShow:true,//控制弹层展示
    activeType:0,//默认选中类型
    typeData:[],//vip数组
    typeId:1,//vip类型id
    payData: {}, // 支付配置参数
    repeatBool: true, // 防止重复请求
  },
  ready() {
    this.vipListFn();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //关闭弹框
    onClose() {
      // this.setData({ vipShow: false });
       // close 是自定义名称事件，父组件中监听使用
       this.triggerEvent('vipShowClose',{ vipShow: false } )
    },
    // 点击切换
    typeChange(event){
        this.setData({
          activeType:event.currentTarget.dataset.idx,
          typeId:event.currentTarget.dataset.id
        })
    },
    // 点击立即开通
    onSubmit(){
      let that = this;
      that.setData({ repeatBool: false}); // 防止重复请求
         // 请求接口获取唤醒支付的参数
         getApp()
         .globalData.api.walkPay({
            type:2,//单篇购买音频 1 VIP购买 2
            uid:wx.getStorageSync('userInfo').uid,
            vid:that.data.typeId
          })
          .then(res => {
            // 得到支付需要的参数信息
            that.setData({ payData: res});
            // 唤起支付弹框
              that.arousePayFn();
          });
    },

    //VIP列表
    vipListFn(){
      let that = this;
      getApp().globalData.api.vipList({
      }).then(res=>{
        if(res.bol==true){
          that.setData({
            typeData:res.data,
          });
        }else{
          wx.showToast({ title: res.data.msg, icon: "none" });
        }
      })
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
           that.triggerEvent('vipShowClose',{ vipShow: false } )
        },
        fail(res) {
          wx.showToast({ title: "支付失败,请求重试", icon: "none" });
        },
        complete(res) {
          that.setData({ repeatBool: true });
        }
      });
    },
    
  }
})
