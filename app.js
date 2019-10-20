//app.js
App({
  currentPosition: 0,
  BGM: {
    src: 'https://m701.music.126.net/20191020204852/649391ffcdbf65bd21450a753dff4f91/jdyyaac/520c/510f/520b/ef783b8c4dfe6e44a9deea1754fc150c.m4a',
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