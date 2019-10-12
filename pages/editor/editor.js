const {
  colors,
  images
} = require('./colors.js')
console.log(images.length)
// pages/editor/editor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bars: [{
      icon: 'skinfill',
      name: '背景',
      panel: 'color'
    }, {
      icon: 'emojiflashfill',
      name: '贴纸'
    }],
    bgColor: '#647f9c',
    panelName: '',
    colors,
    frameHeight: 0,
    materials: images
  },
  onLoad() {
    this.resize()
  },
  // 用于重置画布大小
  resize() {
    const systemInfo = wx.getSystemInfoSync()
    const query = wx.createSelectorQuery()
    query.select('#panel').boundingClientRect()
    query.exec(res => {
      this.setData({
        frameHeight: systemInfo.windowHeight - res[0].height
      })
    })
  },
  changeColor(e) {
    const color = e.currentTarget.dataset.value
    this.setData({ bgColor: color })
  },
  showPanel(e) {
    console.log(e)
    const {
      panelName
    } = e.currentTarget.dataset
    console.log(panelName)
    this.setData({
      panelName,
    })
    this.resize()
  },
  hidePanel() {
    this.setData({
      panelName: '',
    })
    this.resize()
  },
  changeMaterial(e) {
    const {materials} = this.data
    const {x,y,source} = e.detail
    console.log(source)
    console.log(x)
    if (source !=='touch'){
      // const { index } = e.currentTarget.dataset
      // materials[index].x = x, materials[index].y = y
      // this.setData({ materials })
    }
    
  }

})