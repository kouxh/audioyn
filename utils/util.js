
import regeneratorRuntime from "../libs/regenerator/runtime-module";
import account from "../api/loginCode";
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 【 设置存储 】
// --- key 键
// --- value 值
// --- app GetApp()
function setStorage(key, value, app) {
  if (app != null) {
    app.globalData[key] = value;
  }
  wx.setStorageSync(key, value);
}
function dateFormatter(nows) {
  if (!nows) return ''
  var now = new Date(nows)
  var year = now.getFullYear()
 
  var month = now.getMonth() + 1
  month = checkAddZone(month)
 
  var date = now.getDate()
  date = checkAddZone(date)
  return year + '-' + month + '-' + date
}
 
function checkAddZone (num) {
  return num<10 ? '0' + num.toString() : num
}
// 百分数转化为小数
function toPoint(percent){
  var str=percent.replace("%","");
  str= str/100;
  return str;
}
/**
 * 
 * url  要跳转的路径
 * path 从哪个页面过来的 1首页 2 收藏 3 推荐 4 我的
 * isLogin 判断是否授权
 * type 跳转方式 1wx.navigateTo 2 wx.switchTab 3wx.redirectTo 4 wx.reLaunch
 */
const checkLogin=async function  checkLogin (url,path,isLogin,type){
  var response = await account.checkSession();
  let token = wx.getStorageSync('userInfo').token;
  console.log(token,'token')
  if((!response || token==undefined)&& isLogin){
    // wx.showToast({
    //   title: "请先授权登录！",
    //   icon: "none"
    // });
    wx.removeStorageSync("userInfo")
    wx.removeStorageSync("hasBindMobile")
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }else{
        if(type==1){
            wx.navigateTo({
              url: url,
            })
          }else if(type==2){
            wx.switchTab({
              url: url,
            })
          }else if(type==3){
            wx.redirectTo({
              url: url,
            })
          }else if(type==4){
            wx.reLaunch({
              url: url,
            })
          }
  }
  
}
// 按钮防抖
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
  }
  let _lastTime = null
  // 返回新的函数
  return function () {
      let _nowTime = + new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
          fn.apply(this, arguments)   //将this和参数传给原函数
          _lastTime = _nowTime
      }
  }
}

module.exports = {
  formatTime,
  setStorage,
  dateFormatter,
  checkLogin,
  toPoint,
  throttle
}
