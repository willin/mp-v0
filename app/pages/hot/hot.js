// app/pages/hot/hot.js
import regeneratorRuntime from '../../lib/runtime.js';
import { formatDate } from '../../lib/common.js'

Page({
  data: {
    index: 0,
    page: 1,
    pages: 1,
    orderType: ['按热度降序', '按时间降序'],
    hot: []
  },
  onPullDownRefresh: function () {
    this.discover(this.data.page, this.data.index)
      .then(this.prepareData);
  },
  onReachBottom() {
    if(this.data.pages > this.data.page) {
      this.discover(this.data.page + 1, this.data.index)
        .then(this.prepareDataAppend);
    }
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    this.discover(this.data.page, e.detail.value)
      .then(this.prepareData);
  },
  onLoad: function () {
    this.discover(this.data.page, this.data.index)
      .then(this.prepareData);
  },
  discover: async function (page = 1, order = 0) {
    wx.showLoading({
      title: '加载中',
    });

    const limit = 10;
    const skip = (page - 1) * limit;
    const orderBy = order === 0 ? '-liked' : '-time';

    const db = wx.cloud.database();
    const { data: result = []} = await db.collection('comments').skip(skip).limit(limit).orderBy(order === 0 ? 'liked' : 'time', 'desc').get();
   
    wx.hideLoading();
    console.log(result);
    const { total } = await db.collection('comments').count();
    const pages = Math.ceil(total / limit);
    this.setData({
      pages,
      page
    });
    return result;
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
  prepareDataAppend: function (hot) {
    this.setData({
      hot: this.data.hot.concat(
        JSON.parse(JSON.stringify(hot)).map(x => Object.assign(x, {
          created: formatDate('yy年M月d日 h时', x.time),
          likedTip: x.liked > 10000 ? `${Math.round(x.liked / 1000) / 10}万` : x.liked
        }))
      )
    });
    return hot;
  }
})