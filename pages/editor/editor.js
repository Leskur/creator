const {
  colors,
  images,
} = require('./resources.js')
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
      name: '贴纸',
      panel: 'image'
    }],
    bgColor: '#647f9c',
    panelName: '',
    colors,
    images,
    frame: {
      height: 0,
      wdth: 0,
      left: 0,
      top: 0
    },
    currentImagePanelTab: 0,
    materials: []
  },
  onLoad() {
    this.systemInfo = wx.getSystemInfoSync()
    console.log(this.systemInfo)
    this.resize()
  },
  // 用于重置画布大小
  resize() {
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const query = wx.createSelectorQuery()
    query.select('#panel').boundingClientRect()
    query.select('#area').boundingClientRect()
    query.exec(res => {
      console.log(res[1])
      const frameHeight = systemInfo.windowHeight - res[0].height
      const frameWidth = Math.min(frameHeight * 0.7, systemInfo.windowWidth)
      const frameLeft = (systemInfo.windowWidth - frameWidth) / 2
      this.setData({
        frame: {
          height: systemInfo.windowHeight - res[0].height,
          width: frameWidth,
          left: frameLeft,
          right: frameLeft + frameWidth,
          top: 0
        }
      })
      console.log(this.data.frame)
    })
  },
  changeColor(e) {
    const color = e.currentTarget.dataset.value
    this.setData({
      bgColor: color
    })
  },
  showPanel(e) {
    const {
      panelName
    } = e.currentTarget.dataset
    this.setData({
      panelName,
    }, () => {
      this.resize()
    })

  },
  hidePanel() {
    this.setData({
      panelName: '',
    }, () => {
      this.resize()
    })
  },
  selectPanel(e) {
    console.log(e)
    this.setData({
      currentImagePanelTab: e.currentTarget.dataset.index
    })
  },
  addMeterial(e) {
    const {
      group,
      index
    } = e.currentTarget.dataset
    const {
      materials,
      images,
      frame
    } = this.data
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    console.log(frame)
    const image = images[group].list[index]
    materials.push({
      image,
      width: 64,
      height: 90,
      left: systemInfo.windowWidth + frame.left + frame.width * 0.5,
      top: systemInfo.windowHeight
    })
    this.setData({
      materials
    })
    const query = wx.createSelectorQuery()
    query.select('#material-0').boundingClientRect()
    query.exec(res => {
      console.log(res)
    })
  },
  changeMaterial(e) {
    const {
      materials
    } = this.data
    const {
      x,
      y,
      source
    } = e.detail
    const index = e.currentTarget.dataset.index
      materials[index].left = x
      materials[index].top = y
      this.setData({ materials })
      // const { index } = e.currentTarget.dataset
      // materials[index].x = x, materials[index].y = y
      // this.setData({ materials })

  }

})