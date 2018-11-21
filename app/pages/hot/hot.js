// app/pages/hot/hot.js
import regeneratorRuntime from '../../lib/runtime.js';
import { formatDate } from '../../lib/common.js'

const discover = async (page = 1, order = 0) => {
  wx.showLoading({
    title: '加载中',
  });
  // const { result } = await wx.cloud.callFunction({
  //   name: 'hot',
  //   data: {
  //     page,
  //     order
  //   }
  // }).catch(err => {
  //   console.log(err)
  // });

  wx.hideLoading();
  console.log(result);
  return result;
}

Page({
  data: {
    index: 0,
    orderType: ['按热度降序', '按时间降序'],
    hot: []
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: async function () {
    const db = new wx.BaaS.TableObject(57892);

    await db.createMany([

      { test: 6 },

      { test: 3 },

      { test: 4 },

    ]).then(console.log).catch(e => console.error);
  }
})