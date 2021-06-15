// components/list/index.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listData:{
      type: Array,
    },
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    num:0,//播放数量
  },
  /**组件数据字段监听器，用于监听 properties 和 data 的变化 */
  observers: {
  
    ['itemData.num'](num) {
      console.log( this._tranNumber(num,2))
      this.setData({
        num: this._tranNumber(num,2)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
     //点击操作
   onEdit(e) {
     console.log(e,this.data.listData,'----------')
    let item = e.currentTarget.dataset.id;
    let idx=e.currentTarget.dataset.idx;
    console.log(item,idx)
    if(this.data.listData[idx].isBalloon){
      this.data.listData[idx].isBalloon = !this.data.listData[idx].isBalloon
    }else{
      this.data.listData.forEach((item, i) => {
        item.isBalloon = idx == i? true: false
      })
    }
    this.setData({
      listData:this.data.listData
    })
  },
  _tranNumber(num,point){
    let numStr=num.toString().split('.')[0]
    if(numStr.length<6){
      return numStr
    }else if(numStr.length>=6 && numStr.length<=8){
      let decimal=numStr.substring(numStr.length-4,numStr.length-4+point)
      return parseFloat(parseInt(num/10000)+'.'+decimal)+'万'
    }else if(numStr>8){
      let decimal=numStr.substring(numStr.length-8,numStr.length-8+point)
      return parseFloat(parseInt(num/100000000)+'.'+decimal)+'亿'
    }

  }
  }
})
