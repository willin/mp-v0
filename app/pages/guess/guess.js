// app/pages/guess/guess.js
import regeneratorRuntime from '../../lib/runtime.js';
import { formatDate } from '../../lib/common.js'

const guess = async (uid) => {
  wx.showLoading({
    title: '加载中',
  });
  const { result = [] } = await wx.cloud.callFunction({
    name: 'guess',
    data: {
      uid
    }
  }).catch(err => {
    console.log(err)
  });
  wx.hideLoading();
  console.log(result);
  wx.setStorageSync('hot',result);
  return result;
}

Page({
  data: {
    uid: 0,
    hot: []
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
    const hot = wx.getStorageSync('hot');
    const that = this;
    if(hot) {
      this.prepareData(hot);
    } else {
      guess(uid)
        .then(this.prepareData)
        .then(this.updateDB);
    }
  },
  onPullDownRefresh: function () {
    guess(this.data.uid)
      .then(this.prepareData)
      .then(this.updateDB)
      .catch((e)=>{});
  },
  prepareData: function(hot = []) {
    this.setData({
      hot: (JSON.parse(JSON.stringify(hot))||[]).map(x => Object.assign(x, {
        created: formatDate('yy年M月d日 h时', x.time),
        likedTip: x.liked > 10000 ? `${Math.round(x.liked / 1000) / 10}万` : x.liked
      }))
    });
    return hot;
  },
  updateDB: async function(hot = []) {
    // 判断是否要更新到数据库
    const lastSave = ~~wx.getStorageSync('lastSave');
    const now = new Date().getTime() / 1000;
    if (now > lastSave) {
      console.log('更新数据库');
      // 存放数据
      const db = wx.cloud.database();
      for (let i = 0; i < hot.length; i += 1) {
        const comment = hot[i];
        await db.collection('comments').doc('c-' + comment.cid).set({
          data: comment
        }).catch(e => console.error)
      }
      wx.setStorageSync('lastSave', now + 43200);
    }
  }
})