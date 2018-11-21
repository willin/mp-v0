//app.js
import { env, mincloud } from './config.js';

App({
  onLaunch: function(res) {
    wx.cloud.init({
      traceUser: true,
      env
    });
    wx.BaaS = requirePlugin('sdkPlugin');
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    wx.BaaS.init(mincloud);
  },
  onShow: function(){
    wx.showShareMenu({
      withShareTicket: false
    })
  }
})
