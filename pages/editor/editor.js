// pages/editor/editor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test:1,
    bars: [{
      icon: 'skinfill',
      name: '背景',
      panel: 'color'
    }, {
      icon: 'emojiflashfill',
      name: '贴纸'
    }],
    bgColor: '',
    panelName: '',
    colors: ['#fdcdd2', '#fc8a82', '#fc5457', '#fc1f3e', '#b51f23', '#fedfb4', '#fdd084', '#fc8a49', '#dd4f1d', '#b84328', '#e4dc9d', '#ffe36d', '#f4d23c', '#f6c955', '#f1b630', '#9bbc53', '#648835', '#467139', '#345c3b', '#253a25', '#a6d3c4', '#73b2af', '#5da0a9', '#368a7a', '#086352', '#66aecc', '#628baa', '#5695c0', '#1063a1', '#223774', '#7a94b1', '#8081ad', '#656b9c', '#845196', '#564b81', '#f6bbd0', '#ec989b', '#fc81ab', '#fc4482', '#f2105a', '#fffefe', '#cccccc', '#999999', '#666666', '#000000']
  },
  changeColor(e) {
    const color = e.currentTarget.dataset.value
    this.setData({
      bgColor: color
    })
  },
  showPanel(e) {
    console.log(e)
    const { panelName } = e.currentTarget.dataset
    console.log(panelName)
    this.setData({ panelName, test: this.data.test + 1 })
  },
  hidePanel() {
    this.setData({
      panelName: '',
      test:this.data.test + 1
    })
  }
})