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
      top: 0,
      border: 20
    },
    currentImagePanelTab: 0,
    meterials: [{
      "image": "http://qiniu.scdztlzx.com/creator/1-6.png",
      "width": 87.9760092272203,
      "height": 122.37209302325583,
      "x": 1207.0119953863898,
      "y": 1455.3139534883721,
      "top": 407.31395348837214,
      "left": 373.0119953863898,
      "right": 449,
      "bottom": 397.5
    }],
    currentMeterial: -1
  },
  onReady() {
    const systemInfo = wx.getSystemInfoSync()
    this.systemInfo = systemInfo
    this.init()
  },
  init() {
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const area = {
      width: systemInfo.windowWidth * 3,
      height: systemInfo.windowHeight * 3,
      top: -systemInfo.windowHeight,
      left: -systemInfo.windowWidth,
    }
    this.setData({
      area
    }, () => {
      const query = wx.createSelectorQuery()
      query.select('#panel').boundingClientRect()
      query.exec(res => {
        const panel = res[0]
        const frameHeight = systemInfo.windowHeight - panel.height
        const frameWidth = Math.min(frameHeight * 0.7, systemInfo.windowWidth)
        console.log(frameWidth)
        const frameLeft = (systemInfo.windowWidth - frameWidth) / 2
        console.log(frameLeft)
        const frameTop = 0
        this.setData({
          frame: {
            height: frameHeight,
            width: frameWidth,
            left: frameLeft,
            right: frameLeft + frameWidth,
            top: frameTop,
            bottom: frameTop + frameHeight,
            border: 30
          }
        })
      })
    })

  },
  // 用于重置画布大小
  resize() {
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const query = wx.createSelectorQuery()
    const {
      frame,
      meterials
    } = this.data
    query.select('#panel').boundingClientRect()
    query.exec(res => {
      const panel = res[0]
      const frameHeight = systemInfo.windowHeight - panel.height
      const frameWidth = Math.min(frameHeight * 0.7, systemInfo.windowWidth)
      const frameLeft = (systemInfo.windowWidth - frameWidth) / 2
      const frameTop = 0
      const newFrame = {
        height: systemInfo.windowHeight - panel.height,
        width: frameWidth,
        left: frameLeft,
        right: frameLeft + frameWidth,
        top: frameTop,
        bottom: frameTop + frameHeight,
        border: 30
      }

      const scaleX = (newFrame.width - 60) / (frame.width - 60)
      const scaleY = (newFrame.height - 60) / (frame.height - 60)

      meterials.forEach(item => {
        // const itemCenterX = item.left + item.width / 2
        // const itemCenterX = item.left + item.width / 2
        item.width *= scaleX
        item.height *= scaleY
        item.left = newFrame.left + (item.left - frame.left - 30) * scaleX + 30
        item.top = newFrame.top + (item.top - frame.top - 30) * scaleY + 30
        //   console.log(item.top)
        item.x = systemInfo.windowWidth + item.left
        item.y = systemInfo.windowHeight + item.top
      })
      console.log(JSON.stringify(meterials))

      this.setData({
        frame: newFrame,
        meterials,
        currentMeterial: -1
      })
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
    this.setData({
      currentImagePanelTab: e.currentTarget.dataset.index
    })
  },
  cancelSelect() {
    this.setData({
      currentMeterial: -1
    })
  },
  addMeterial(e) {
    const {
      group,
      index
    } = e.currentTarget.dataset
    const {
      meterials,
      images,
      frame
    } = this.data
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const image = images[group].list[index]

    const x = systemInfo.windowWidth + frame.left + frame.width / 2 - 32
    const y = systemInfo.windowHeight + frame.top + frame.height / 2 - 45
    const meterial = {
      image,
      width: 64,
      height: 90,
      x,
      y,
    }
    meterial.top = y - systemInfo.windowHeight
    meterial.left = x - systemInfo.windowWidth
    meterial.right = meterial.left + meterial.width
    meterial.bottom = meterial.top + meterial.height

    meterials.push(meterial)
    console.log(JSON.stringify(meterial))
    this.setData({
      meterials,
      currentMeterial: meterials.length - 1
    })
  },
  delMeterial(e) {
    const {
      meterials
    } = this.data
    meterials.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      currentMeterial: -1,
      meterials
    })
  },
  selectMeterial(e) {
    this.setData({
      currentMeterial: e.currentTarget.dataset.index,
    })
  },
  changemeterial(e) {
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const {
      meterials,
      frame,
      currentMeterial
    } = this.data
    
    
    const {
      x,
      y,
      source
    } = e.detail
    if (source == 'touch') {
      const index = e.currentTarget.dataset.index
      if (currentMeterial != index) {
        this.setData({
          currentMeterial: index
        })
      }
      meterials[index].x = x
      meterials[index].y = y
      meterials[index].top = y - systemInfo.windowHeight
      meterials[index].right = x + 64 - systemInfo.windowWidth
      meterials[index].bottom = y + 90 - systemInfo.windowHeight
      meterials[index].left = x - systemInfo.windowWidth
      console.log(meterials[index].left)
      console.log(frame.left)
      this.setData({
        meterials
      })
    }
  },
  scaleMeterial(e) {
    const changedTouche = e.changedTouches[0]
    const index = e.currentTarget.dataset.index
    const { meterials } = this.data
    const meterial = meterials[index]
    console.log(meterial)
    console.log(changedTouche)
  }

})