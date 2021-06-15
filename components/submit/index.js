// components/submit/index.js
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
    problemShow:true,//控制弹出的显示隐藏
  },

  /**
   * 组件的方法列表
   */
  methods: {
     //关闭弹层
     closeMask(){
      // close 是自定义名称事件，父组件中监听使用
      this.triggerEvent('problemClose',{ problemShow: false } )
    },
  }
})
