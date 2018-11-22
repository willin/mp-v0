// app/pages/search/song.js
import regeneratorRuntime from '../../lib/runtime.js';
import { formatDate } from '../../lib/common.js'

const song = async (id) => {
  wx.showLoading({
    title: '加载中',
  });
  const { result = [] } = await wx.cloud.callFunction({
    name: 'song',
    data: {
      id
    }
  }).catch(err => {
    console.log(err)
  });
  wx.hideLoading();
  console.log(result);
  return result;
}

Page({
  data: {
    id: -1,
    music: '',
    artist: ''
  },
  onLoad: function ({id = -1, music = '', artist = ''}) {
    this.setData({
      id,
      music,
      artist
    });
    song(id).then(this.addInfo).then(this.prepareData).then(this.updateDB);
  },
  addInfo: function(result) {
    return result.map((item) => {
      item.music = this.data.music;
      item.artist = this.data.artist;
      return item;
    });
  },
  prepareData: function (hot) {
    this.setData({
      hot: JSON.parse(JSON.stringify(hot)).map(x => Object.assign(x, {
        created: formatDate('yy年M月d日 h时', x.time),
        likedTip: x.liked > 10000 ? `${Math.round(x.liked / 1000) / 10}万` : x.liked
      }))
    });
    return hot;
  },
  updateDB: async function (hot) {
    // 存放数据
    const db = wx.cloud.database();
    for (let i = 0; i < hot.length; i += 1) {
      const comment = hot[i];
      await db.collection('comments').doc('c-' + comment.cid).set({
        data: comment
      }).catch(e => console.error)
    }
  }
})