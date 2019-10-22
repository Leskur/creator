//app.js
App({
  currentPosition: 0,
  BGM: {
    src: 'https://image.chinafuturelink.org/creator/Thomas%20Greenberg%20-%20Magic%20Castle.mp3',
    title: 'Magic Castle'
  },
  BGMCurrentTime: 0,
  onLaunch() {
    this.BGMCurrentTime = 0
    const BGAM = wx.getBackgroundAudioManager()
    BGAM.onTimeUpdate(() => {
      this.BGMCurrentTime = BGAM.currentTime
    })
    BGAM.onEnded(() => {
      BGAM.src = this.BGM.src
      BGAM.title = this.BGM.title
      BGAM.startTime = 0
      this.BGMCurrentTime = 0
    })
  },

  onShow() {
    const BGAM = wx.getBackgroundAudioManager()
    BGAM.title = this.BGM.title
    BGAM.src = this.BGM.src
    BGAM.startTime = Math.max(this.BGMCurrentTime, BGAM.currentTime)
  },
  onHide() {
    const BGAM = wx.getBackgroundAudioManager()
    BGAM.pause()
  }
})