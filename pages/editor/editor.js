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
    bgColor: '#5695c0',
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
    frame: null,
    currentImagePanelTab: 0,
    meterials: [],
    currentMeterial: -1,
    saving: false
  },
  onLoad(options) {
    // horizontal | cloumn
    this.direction = options.mode || 'cloumn'
    const systemInfo = wx.getSystemInfoSync()
    this.setData({ systemInfo })
    this.systemInfo = systemInfo
    this.init()
    wx.authorize({ scope: "scope.writePhotosAlbum" })
  },
  offsetFrame: async function() {
    const systemInfo = wx.getSystemInfoSync()
    const direction = this.direction
    const query = wx.createSelectorQuery()
    query.select('#panel').boundingClientRect()
    return await new Promise((resolve) => {
      query.exec(res => {
        const panel = res[0]
        const oldFrame = this.data.frame
        const frameHeight = direction == 'cloumn' ? systemInfo.windowHeight - panel.height : (systemInfo.windowHeight - panel.height) * 0.618
        const border = systemInfo.windowWidth * 0.03;
        const frameWidth = direction == 'cloumn' ? Math.min(frameHeight * 0.7, systemInfo.windowWidth) : (oldFrame ? (frameHeight - 2 * border) / (oldFrame.height - 2 * oldFrame.border) * oldFrame.width : systemInfo.windowWidth);
        
        const frameLeft = (systemInfo.windowWidth - frameWidth) / 2
        const frameTop = (systemInfo.windowHeight - frameHeight - panel.height) / 2
        const frame = {
          height: frameHeight,
          width: frameWidth,
          left: ~~frameLeft,
          right: frameLeft + frameWidth,
          top: frameTop,
          bottom: frameTop + frameHeight,
          border: border
        }
        this.setData({ frame })
        resolve(frame)
      })
    })
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
      this.offsetFrame()
    })

  },
  // 用于重置画布大小
  async resize() {
    const {
      frame,
      meterials
    } = this.data
    const newFrame = await this.offsetFrame()
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const scaleX = (newFrame.width - newFrame.border * 2) / (frame.width - frame.border * 2)
    const scaleY = (newFrame.height - newFrame.border * 2) / (frame.height - frame.border * 2)
    meterials.forEach(item => {
      item.width *= scaleX
      item.height *= scaleY
      item.left = newFrame.left + (item.left - frame.left - frame.border) * scaleX + newFrame.border
      item.top = newFrame.top + (item.top - frame.top - frame.border) * scaleY + newFrame.border

      item.x = systemInfo.windowWidth + item.left
      item.y = systemInfo.windowHeight + item.top

    })
    this.setData({
      meterials,
      currentMeterial: -1
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
    const direction = this.direction
    const systemInfo = this.systemInfo || wx.getSystemInfoSync()
    const image = images[group].list[index]

    const meterial = {
      image,
      width: direction == 'column' ? 90 : 90,
      height: direction == 'column' ? 90 : 90,
    }

    const x = systemInfo.windowWidth + frame.left + frame.width / 2 - meterial.width / 2
    const y = systemInfo.windowHeight + frame.top + frame.height / 2 - meterial.height / 2
    meterial. x = x;
    meterial.y = y
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
    const { meterials } = this.data
    const index = e.currentTarget.dataset.index
    const meterial = meterials.splice(index, 1)[0]
    meterials.push(meterial)
    this.setData({
      meterials,
      currentMeterial: meterials.length - 1
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
    this.setData({ saving: true })
    const ctx = wx.createCanvasContext('canvas')
    const { meterials, frame, bgColor } = this.data;
    ctx.setFillStyle(bgColor)
    ctx.fillRect(0, 0, frame.width, frame.height)
    ctx.draw()


    try {
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

      // 加 logo 水印
      await promisify(wx.getImageInfo)({ src: 'https://image.chinafuturelink.org/creator/temp/mark-logo.png' }).then(res => {
        const width = res.width / 5
        const height = res.height / 5
        ctx.drawImage(res.path, frame.width - 1.5 * frame.border - width, frame.height - 1.5 * frame.border - height, width, height)
      })
      // 加文字水印
      await promisify(wx.getImageInfo)({ src: 'https://image.chinafuturelink.org/creator/temp/mark-font.png' }).then(res => {
        const width = res.width / 3
        const height = res.height / 3
        ctx.drawImage(res.path, 1.5 * frame.border, (frame.height - height) / 2, width, height)
      })
    }catch {
      this.setData({ saving: false })
      return wx.showToast({ title: 'Unable to connect to network', icon: 'none' })
    }

    
    
   

    ctx.draw(true, () => {
      this.setData({ saving: false })
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success(res) {
          const image = res.tempFilePath
          // wx.previewImage({
          //   urls: [image],
          // })
          wx.saveImageToPhotosAlbum({
            filePath: image,
            success(res) { 
              wx.navigateTo({
                url: `/pages/save/save?image=${image}`,
              })
            }
          })
          
        }
      })

    })
  }
})