// app/pages/mine/mine.js
Page({
  data: {
    uid: 0,
    yearNow:  new Date().getFullYear()
  },
  onLoad: function() {
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
  },
  logout: function() {
    wx.showModal({
      title: '切换账号',
      content: '确定是否要清除当前绑定的用户？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('user');
          wx.redirectTo({
            url: '../mine/login'
          });
        } 
      }
    });
  }
})