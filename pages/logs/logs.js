// // logs.js
// const util = require('../../utils/util.js')

// Page({
//   data: {
//     logs: []
//   },
//   onLoad() {
//     this.setData({
//       logs: (wx.getStorageSync('logs') || []).map(log => {
//         return {
//           date: util.formatTime(new Date(log)),
//           timeStamp: log
//         }
//       })
//     })
//   }
// })
// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    progress: 0,
    duration:12,
    dataList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,30,31,32,33,34,35,45],
    count : 0,
    pageStart:0,
    pageSize:3,//
    sum:0,
    loading:true,
    newList:[],
    page:1,
    n:6,
    pagesCount:'',
    currentIndex: 0,
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
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    that.setData({
      pagesCount:Math.ceil(that.data.dataList.length/that.data.n)
    });
    if(that.data.pagesCount>that.data.page){
      that.setData({
        newList:that.data.dataList.slice(that.data.page-1,that.data.n),
      })
    }else{
      that.setData({
        newList:that.data.dataList,
        loading:false
      })
    }
   
  },

  changeSwiper: function (e) {
    this.setData({
    currentIndex: e.detail.current
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
    // var self = this;
	 	// setTimeout(() => {
	  // 	// 模拟请求数据，并渲染
		//   	var arr = self.data.dataList, max = Math.max(...arr);
		//   	for (var i = max + 1; i <= max + 3; ++i) {
		// 		arr.unshift(i);
		// 	}
	  // 		self.setData({ dataList: arr });
		// 	  // 数据成功后，停止下拉刷新
		// 	wx.stopPullDownRefresh();
		//  }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
    // var arr = this.data.dataList, max = Math.max(...arr);
	 	// if (this.data.count < 3) {
		//   	for (var i = max + 1; i <= max + 5; ++i) {
		//   		arr.push(i);
		//   	}
		// 	this.setData({
		// 	  dataList: arr,
		// 	  count: ++this.data.count
		// 	 });
	 	// } else {
		// 	wx.showToast({
		// 	  title: '没有更多数据了！',
		// 	  image: '../../src/images/noData.png',
		// 	})
     // }
     var that = this
 console.log(that.data.pagesCount)
 wx.showLoading({
  title: '玩命加载中',
})
 if(that.data.pagesCount>that.data.page){
     
  that.setData({
    page: ++that.data.page,
    newList:that.data.newList.concat(that.data.dataList.slice((that.data.page-1) * that.data.n, (that.data.page) * that.data.n))
  })
  
 }else{
  that.setData({
    newList:that.data.dataList,
    loading:false
  })
 }
 wx.hideLoading();
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
   
 
    //  var list = that.data.dataList
    //  var page = that.data.page
    //  var n = that.data.n
    //  if ((page) < Math.ceil(list.length/n)){
    //    var list1 =list.slice((page) * n, (page) * n)
    //    console.log(list1)
    //    var goodsList = list.concat(list1)
    //    console.log(goodsList)
    //    that.setData({
    //      newList: goodsList
    //    });
    //   //  page++;
    //   //  that.setData({
    //   //    page: page
    //   //  })
    //    wx.hideLoading();
    //  }else{
    //   wx.hideLoading();
    //  }

  },
  containerTap1: function (res) {
    console.log(res.touches[0]);
    var x = res.touches[0].pageX;
    var y = res.touches[0].pageY + 85;
    this.setData({
    rippleStyle: ''
    });
    
    this.setData({
    rippleStyle: 'top:' + y + 'px;left:' + x + 'px;-webkit-animation: ripple 0.4s linear;animation:ripple 0.4s linear;'
    
    });
    
    },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})



// // pages/home/index.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     dataList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,30,31,32,33,34,35,45],
//     count : 0,
//     sum:0,
//     loading:true,
//     newList:[],
//     page:1,
//     n:6,
//     pagesCount:'',
//     active: 0,
//     value:''
//   },


//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
//     let that=this;
//     that.setData({
//       pagesCount:Math.ceil(that.data.dataList.length/that.data.n)
//     });
//     this.loadmore()
   
//   },
//   onSearch(e) {
//     console.log(e.detail)
//   },
//   onChange(event) {
//     console.log(event)
//     this.setData({
//       active:event.detail.index,
//     })
//     wx.showToast({
//       title: `切换到标签 ${event.detail.name}`,
//       icon: 'none',
//     });
//     console.log(this.data.active)
//   },
//   loadmore(){
//     //加载提示
//     wx.showLoading({
//       title: '加载中',
//     })
//     var that = this;
//     console.log(that.data.pagesCount,that.data.page)
//     if(that.data.pagesCount>that.data.page){
//       that.setData({
//         newList:that.data.newList.concat(that.data.dataList.slice((that.data.page-1) * that.data.n, (that.data.page) * that.data.n)),
//         page: ++that.data.page,
//       })
//       console.log(that.data.pagesCount,that.data.page)
//     }else{
//       console.log('---')
//       that.setData({
//         newList:that.data.dataList,
//         loading:false,
//         // dataList:[]
//       })
//          wx.showToast({
//         title: '没有更多数据了',
//       })
//     }
//     wx.hideLoading();
//   },


//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {
//     // var self = this;
// 	 	// setTimeout(() => {
// 	  // 	// 模拟请求数据，并渲染
// 		//   	var arr = self.data.dataList, max = Math.max(...arr);
// 		//   	for (var i = max + 1; i <= max + 3; ++i) {
// 		// 		arr.unshift(i);
// 		// 	}
// 	  // 		self.setData({ dataList: arr });
// 		// 	  // 数据成功后，停止下拉刷新
// 		// 	wx.stopPullDownRefresh();
// 		//  }, 1000);
//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {
  
//     // var arr = this.data.dataList, max = Math.max(...arr);
// 	 	// if (this.data.count < 3) {
// 		//   	for (var i = max + 1; i <= max + 5; ++i) {
// 		//   		arr.push(i);
// 		//   	}
// 		// 	this.setData({
// 		// 	  dataList: arr,
// 		// 	  count: ++this.data.count
// 		// 	 });
// 	 	// } else {
// 		// 	wx.showToast({
// 		// 	  title: '没有更多数据了！',
// 		// 	  image: '../../src/images/noData.png',
// 		// 	})
//      // }
    
//      var that = this;
//      that.loadmore();
//     //  console.log(that.data.pagesCount,that.data.page)
//     //  if(that.data.pagesCount>=that.data.page){
//     //   that.loadmore()
//     // }else{
//     //   wx.showToast({
//     //     title: '没有更多数据了',
//     //   })
//     // }
// //  console.log(that.data.pagesCount)
// //  wx.showLoading({
// //   title: '玩命加载中',
// // })
// //  if(that.data.pagesCount>that.data.page){
     
// //   that.setData({
// //     page: ++that.data.page,
// //     newList:that.data.newList.concat(that.data.dataList.slice((that.data.page-1) * that.data.n, (that.data.page) * that.data.n))
// //   })
  
// //  }else{
// //   that.setData({
// //     newList:that.data.dataList,
// //     loading:false
// //   })
// //  }
// //  wx.hideLoading();
//     // wx.showLoading({
//     //   title: '玩命加载中',
//     // })
   
 
//     //  var list = that.data.dataList
//     //  var page = that.data.page
//     //  var n = that.data.n
//     //  if ((page) < Math.ceil(list.length/n)){
//     //    var list1 =list.slice((page) * n, (page) * n)
//     //    console.log(list1)
//     //    var goodsList = list.concat(list1)
//     //    console.log(goodsList)
//     //    that.setData({
//     //      newList: goodsList
//     //    });
//     //   //  page++;
//     //   //  that.setData({
//     //   //    page: page
//     //   //  })
//     //    wx.hideLoading();
//     //  }else{
//     //   wx.hideLoading();
//     //  }

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })

// that.setData({
//   // total:that.data.likeData.length
//   pagesCount:Math.ceil(that.data.likeData.length/that.data.pageSize)
// })
// this.replaceFn();

// if(that.data.total>that.data.pageSize){
//   that.setData({
//     newList:that.data.likeData.slice(that.data.pageStart,that.data.pageSize),
//   })
// }else{
//   that.setData({
//     newList:that.data.likeData,
//     loading:false
//   })
// }
// replaceFn(){
  // this.setData({
  //   pageStart:this.data.pageStart+5,
  //   pageSize:this.data.pageSize+5,
  // })
  // console.log(this.data.pageStart,this.data.pageSize)
  // if(this.data.pageSize<this.data.total){
  //   this.setData({
  //     // newList:this.data.newList.concat(this.data.dataList.slice(this.data.pageStart,this.data.pageSize))
  //     newList:this.data.likeData.slice(this.data.pageStart,this.data.pageSize)
  //   })
  // }else{
  //      this.setData({
  //       newList:this.data.likeData,
  //       loading:false,
  //       // dataList:[]
  //     })
  //     console.log(this.data.loading)
  // }


      //加载提示
  // wx.showLoading({
  //   title: '加载中',
  // })
  // var that = this;
  // console.log(that.data.pagesCount,that.data.pageStart)
  // if(that.data.pagesCount>that.data.pageStart){
  //   that.setData({
  //     newList:that.data.likeData.slice((that.data.pageStart-1) * that.data.pageSize, (that.data.pageStart) * that.data.pageSize),
  //     pageStart: ++that.data.pageStart,
  //   })
  //   console.log(that.data.pagesCount,that.data.pageStart)
  // }else{
  //   console.log('---')
  //   that.setData({
  //     newList:that.data.likeData.slice((that.data.pageStart-1) * that.data.pageSize, (that.data.pageStart) * that.data.pageSize),
  //     loading:false,
  //     // dataList:[]
  //   })
  //      wx.showToast({
  //     title: '没有更多数据了',
  //   })
  // }
  // wx.hideLoading();

// },