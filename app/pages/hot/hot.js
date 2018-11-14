// app/pages/hot/hot.js
Page({
  data: {
    uid: 0
  },
  onLoad: function () {
    const uid = wx.getStorageSync('user');
    if (!uid) {
      wx.redirectTo({
        url: '../mine/login'
      });
      return;
    }
    this.setData({
      uid
    });
  }
})