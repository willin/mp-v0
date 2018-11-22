// app/pages/search/search.js
import regeneratorRuntime from '../../lib/runtime.js';

const app = getApp();

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    result: []
  },
  search: async function(e) { 
    wx.showLoading({
      title: '加载中',
    });
    const { result = [] } = await wx.cloud.callFunction({
      name: 'search',
      data: {
        keywords: e.detail.value
      }
    }).catch(err => {
      console.log(err)
    });
    wx.hideLoading();
    console.log(result);
    this.setData({
      result
    });
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }
});
