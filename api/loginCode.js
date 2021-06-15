import regeneratorRuntime from "../libs/regenerator/runtime-module";
import config from "./config.js";
import httpClient from "./httpClient.js";
import {
  setStorage
} from "../utils/util";

export default {
  // 微信登陆(获得code)
  getWxCode() {
    return new Promise(function (resolve, reject) {
      wx.login({
        success(res) {
          resolve(res);
        }
      });
    });
  },
  /***
   * 检查wx.login 是否过期
   */
  checkSession() {
    return new Promise(function (resolve, reject) {
      wx.checkSession({
        success: function (res) {
          resolve(res);
        },
        fail: function (err) {
          resolve();
        }
      });
    });
  },
};