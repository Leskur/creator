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
    area: {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    },
    frame: {
      height: 0,
      wdth: 0,
      left: 0,
      top: 0
    },
    currentImagePanelTab: 0,
    materials: []
  },
  onReady() {
    const systemInfo = wx.getSystemInfoSync()
    this.systemInfo = systemInfo
    this.init()
    // console.log(this.systemInfo)
    // this.resize()
  },
  init() {
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const area = {
      width: systemInfo.windowWidth * 3,
      height: systemInfo.windowHeight * 3,
      top: - systemInfo.windowHeight,
      left: - systemInfo.windowWidth,

    }
    this.setData({ area }, () => {
      const query = wx.createSelectorQuery()
      query.select('#panel').boundingClientRect()
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
    })
    
  },
  // 用于重置画布大小
  resize() {
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const query = wx.createSelectorQuery()
    query.select('#panel').boundingClientRect()
    query.exec(res => {
      const panel = res[0]
      const frameHeight = systemInfo.windowHeight - panel.height
      const frameWidth = Math.min(frameHeight * 0.7, systemInfo.windowWidth)
      const frameLeft = (systemInfo.windowWidth - frameWidth) / 2
      const frameTop = 0
      this.setData({
        frame: {
          height: systemInfo.windowHeight - panel.height,
          width: frameWidth,
          left: frameLeft,
          right: frameLeft + frameWidth,
          top: frameTop,
          bottom: frameTop + frameHeight
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

    const x = systemInfo.windowWidth + frame.left + frame.width / 2 - 32
    const y = systemInfo.windowHeight + frame.top + frame.height / 2 - 45

    materials.push({
      image,
      width: 64,
      height: 90,
      x,
      y,
      // top: y - systemInfo.windowHeight,
      // right: x + 64 - systemInfo.windowWidth,
      // bottom: y + 90 - systemInfo.windowHeight,
      // left: x - systemInfo.windowWidth
    })
    this.setData({
      materials
    })
    const query = wx.createSelectorQuery()
    query.select('#material-0').boundingClientRect()
    query.exec(res => {
      console.log(res[0])
    })
  },
  changeMaterial(e) {
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const {
      materials
    } = this.data
    const {
      x,
      y,
      source
    } = e.detail
    console.log(e.detail)
    if(source == 'touch') {
      const index = e.currentTarget.dataset.index
      materials[index].x = x
      materials[index].y = y
      materials[index].y - systemInfo.windowHeight,
      materials[index].right= x + 64 - systemInfo.windowWidth,
      materials[index].bottom = y + 90 - systemInfo.windowHeight,
      materials[index].left = x - systemInfo.windowWidth
      this.setData({ materials })
    }
  }

})