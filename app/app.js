//app.js
App({
  onLaunch: function(res) {
    wx.cloud.init({
      traceUser: true,
    })
  },
  onShow: function(){
    wx.showShareMenu({
      withShareTicket: true
    })
  }
})
