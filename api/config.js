module.exports = {
  // 是否线上环境 true正式 false测试
  // develop 开发版  trial 体验版  release正式版
  //  let Version = wx.getAccountInfoSync().miniProgram.envVersion
  isRelease() {
    return true;
  },
  // api请求域名
  getConfig() {
    if (this.isRelease()) {
      //正式
      return "https://walkm.chinamas.cn/";
    } else {
      //测试
      return "https://walkm.chinamas.cn/";
    }
  },

};