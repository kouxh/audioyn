import fetch from "./http";
export default {
  /**
   *登录
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  login(params) {
    return fetch.fetchPost("walk/login", params);
  },
  /**
   *杂志音频列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  maWalkList(params) {
    return fetch.fetchGet("walk/MaWalkList", params);
  },
  /**
   *获取杂志下所有音频
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getMagazineAudio(params) {
    return fetch.fetchGet("walk/getMagazineAudio", params);
  },
  /**
   *排行榜
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  rankingList(params) {
    return fetch.fetchGet("walk/RankingList", params);
  },
  /**
   *音频详情
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  contentDesc(params) {
    return fetch.fetchGet("walk/ContentDesc", params);
  },
  /**
   *用户的基本信息
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  getUserInfo(params) {
    return fetch.fetchGet("walk/GetUserInfo", params);
  },
  /**
   *用户购买记录
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  purchaseRecords(params) {
    return fetch.fetchGet("walk/purchaseRecords", params);
  },
   /**
   *免费榜
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  freeList(params) {
    return fetch.fetchGet("walk/FreeList", params);
  },

   /**
   *推荐列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  recommendList(params) {
    return fetch.fetchGet("walk/RecommendList", params);
  },
  /**
   *意见反馈
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  opinionBack(params) {
    return fetch.fetchPost("walk/opinionBack", params);
  },
  /**
   *专栏列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  columnList(params) {
    return fetch.fetchGet("walk/columnList", params);
  },
   /**
   *搜索页面
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  searchVocabularyList(params) {
    return fetch.fetchGet("walk/searchVocabularyList", params);
  },
  /**
   *搜索结果列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  searchList(params) {
    return fetch.fetchGet("walk/SearchList", params);
  },
  /**
   *加入收藏
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  collectionAdd(params) {
    return fetch.fetchGet("walk/CollectionAdd", params);
  },
  /**
   *取消收藏
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  cancelCollection(params) {
    return fetch.fetchGet("walk/cancelCollection", params);
  },
  /**
   *收藏列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  collectionList(params) {
    return fetch.fetchGet("walk/CollectionList", params);
  },
  /**
   *最近收听
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  recentListening(params) {
    return fetch.fetchGet("walk/RecentListening", params);
  },
  /**
   *VIP列表
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  vipList(params) {
    return fetch.fetchGet("walk/vipList", params);
  },
  /**
   *播单
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  menuList(params) {
    return fetch.fetchGet("walk/broadcast_list", params);
  },
  /**
   *支付
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  walkPay(params) {
    return fetch.fetchPost("walk/walkPay", params);
  },
  /**
   *修改最近收听总时长、已听时长
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  listening(params) {
    return fetch.fetchPost("walk/addRecentListening", params);
  },
  /**
   *修改用户基本信息
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  upUserInfo(params) {
    return fetch.fetchPost("walk/upUserInfo", params);
  },
}