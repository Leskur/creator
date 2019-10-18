const {
  colors,
  images,
} = require('./resources.js')
const promisify = require('../../utils/promisify.js')

// pages/editor/editor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bars: [{
      icon: 'cuIcon- iconfont icon-bg',
      name: 'Background',
      panel: 'color'
    }, {
        icon: 'cuIcon-emojiflashfill',
      name: 'Sticker',
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
    meterials: [],
    currentMeterial: -1
  },
  onLoad() {
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
        const frameLeft = (systemInfo.windowWidth - frameWidth) / 2
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
        item.width *= scaleX
        item.height *= scaleY
        item.left = newFrame.left + (item.left - frame.left - 30) * scaleX + 30
        item.top = newFrame.top + (item.top - frame.top - 30) * scaleY + 30
        item.x = systemInfo.windowWidth + item.left
        item.y = systemInfo.windowHeight + item.top
      })

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
    this.hideSave()
  },
  hidePanel() {
    this.setData({
      panelName: '',
    }, () => {
      this.resize()
    })
    if (this.data.meterials.length > 0 ) this.showSave()
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
    if (meterials.length == 0) {
      this.hideSave()
    }
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
      this.setData({
        meterials
      })
    }
  },
  scaleMeterial(e) {
    if (this.scaleing) return
    const changedTouche = e.changedTouches[0]
    const index = e.currentTarget.dataset.index
    const { meterials } = this.data
    const meterial = meterials[index]
    this.setData({ meterials })
    
    const meterialCenterX = meterial.left + meterial.width / 2
    const meterialCenterY = meterial.top + meterial.height / 2
    const x = changedTouche.pageX
    const y = changedTouche.pageY
    const scale = (changedTouche.pageX - meterialCenterX) * (y - meterialCenterY) / (meterial.width / 2 * meterial.height / 2 )
    // 最小缩放倍数
    if(scale >= 0.5) {
      const systemInfo = this.systemInfo || wx.getSystemInfoSync()
      meterial.width *= scale
      meterial.height *= scale
      meterial.left = meterialCenterX - meterial.width / 2
      meterial.top = meterialCenterY - meterial.height / 2
      meterial.right = meterial.left + meterial.width
      meterial.bottom = meterial.top + meterial.height
      meterial.x = meterial.left + systemInfo.windowWidth
      meterial.y = meterial.top + systemInfo.windowHeight
      this.scaleing = true
      this.setData({ meterials }, () => {
        this.scaleing = false
      })
    }
    
    
  },
  rotateMeterial(e) {
    const changedTouche = e.changedTouches[0]
    const index = e.currentTarget.dataset.index
    const { meterials } = this.data
    const meterial = meterials[index]
    this.setData({ meterials })

    const meterialCenterX = meterial.left + meterial.width / 2
    const meterialCenterY = meterial.top + meterial.height / 2
    const x = changedTouche.pageX
    const y = changedTouche.pageY
    
    var lengthAB = Math.sqrt(Math.pow(meterialCenterX - meterialCenterX, 2) +
      Math.pow(meterialCenterY - meterial.top, 2)),
      lengthAC = Math.sqrt(Math.pow(meterialCenterX - x, 2) +
        Math.pow(meterialCenterY - y, 2)),
      lengthBC = Math.sqrt(Math.pow(meterialCenterX - x, 2) +
        Math.pow(meterial.top - y, 2));
    var cosA = (Math.pow(lengthAB, 2) + Math.pow(lengthAC, 2) - Math.pow(lengthBC, 2)) / (2 * lengthAB * lengthAC);
    var angleA = Math.round(Math.acos(cosA) * 180 / Math.PI);
      meterial.rotate = x <= meterialCenterX ? -angleA : angleA
      this.setData({ meterials })
  },
  showSave() {
    this.setData({ showSave: true })
  },
  hideSave() {
    this.setData({ showSave: false })
  },
  async save() {
    wx.showLoading({ title: 'saving', mask: true })
    const ctx = wx.createCanvasContext('canvas')
    const { meterials, frame, bgColor } = this.data;
    ctx.setFillStyle(bgColor)
    ctx.fillRect(0, 0, frame.width, frame.height)
    ctx.draw()

    for (let i in meterials) {
      const meterial = meterials[i]
      const res = await promisify(wx.getImageInfo)({ src: meterials[i].image })
      if (!meterial.rotate) {
        ctx.drawImage(res.path, meterial.left - frame.left, meterial.top - frame.top + (meterial.height - meterial.width) / 2, meterial.width, meterial.width)
      } else {
        const centerX = meterial.left - frame.left + meterial.width / 2
        const centerY = meterial.top - frame.top + meterial.height / 2
        ctx.translate(centerX, centerY)
        ctx.rotate((meterial.rotate || 0) * Math.PI / 180)
        ctx.drawImage(res.path, -meterial.width / 2, -meterial.width / 2, meterial.width, meterial.width)
        ctx.rotate(-(meterial.rotate || 0) * Math.PI / 180)
        ctx.translate(-centerX, -centerY)
      }
    }

    ctx.setStrokeStyle('white')
    ctx.setLineWidth(frame.border)
    ctx.strokeRect(frame.border / 2, frame.border / 2, frame.width - frame.border, frame.height - frame.border)

    ctx.draw(true, () => {
      wx.hideLoading()
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success(res) {
          wx.previewImage({
            urls: [res.tempFilePath],
          })
        }
      })

    })
  }
})