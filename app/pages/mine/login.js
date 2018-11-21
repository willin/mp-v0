// app/pages/mine/login.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    yearNow: new Date().getFullYear(),
    phone: "",
    pwd: "",
    uid: "",
    tabs: ["登录", "手动"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  textinput: function (event) {
    var type = event.currentTarget.dataset.type;

    if (type == 1) {
      this.setData({
        phone: event.detail.value
      })
    } else if(type == 2) {
      this.setData({
        pwd: event.detail.value
      })
    } else {
      this.setData({
        uid: event.detail.value
      })
    }
  },
  login: function() {
    const {phone, pwd} = this.data;
    const data = {phone, pwd};

    wx.cloud.callFunction({
      name: 'login',
      data
    }).then(res=>{
      const uid = res.result.uid;
      if(uid == 0){
        return wx.showModal({
          content: '用户名或密码错误',
          showCancel: false
        });
      }
      wx.setStorageSync('user', uid);
      wx.switchTab({
        url: '../hot/hot'
      });
    }).catch(err=>{
      console.log(err)
    });
  },
  save: function() {
    // 12797402
    wx.setStorageSync('user', this.data.uid);
    wx.switchTab({
      url: '../hot/hot'
    });
  }
})