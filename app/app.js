//app.js
import { env } from './config.js';

App({
  onLaunch: function(res) {
    wx.cloud.init({
      traceUser: true,
      env
    });
  },
  onShow: function(){
    wx.showShareMenu({
      withShareTicket: false
    })
  }
})
