//app.js
App({
  currentPosition: 0,
  BGM: {
    src: 'https://m701.music.126.net/20191020122330/0eaa7cc94ce0e1bebb0e1700fd73c46e/jdyyaac/0752/0f0b/565f/087cda85ba8a866ddeb1a5fcaf7b44b0.m4a',
    title: 'Rain'
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
  }
})