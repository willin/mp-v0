// app/pages/hot/hot.js
function formatDate(inputPattern, inputDate) {
  const date = new Date(inputDate).toString() === 'Invalid Date' ? new Date() : new Date(inputDate);
  let pattern = inputPattern || 'yyyy-MM-dd hh:mm:ss';
  const y = date.getFullYear().toString();
  const o = {
    M: date.getMonth() + 1, // month
    d: date.getDate(), // day
    h: date.getHours(), // hour
    m: date.getMinutes(), // minute
    s: date.getSeconds() // second
  };
  pattern = pattern.replace(/(y+)/ig, (a, b) => y.substr(4 - Math.min(4, b.length)));
  /* eslint no-restricted-syntax:0,guard-for-in:0 */
  for (const i in o) {
    pattern = pattern.replace(new RegExp(`(${i}+)`, 'g'), (a, b) => ((o[i] < 10 && b.length > 1) ? `0${o[i]}` : o[i]));
  }
  return pattern;
};

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
      console.log(hot);
      this.setData({
        hot: hot
      });
    } else {
      wx.cloud.callFunction({
        name: 'user_hot',
        data: {
          uid
        }
      }).then(res => {
        console.log(res.result);
        const newHot = res.result.map(x => Object.assign(x, {
          created: formatDate('yyyy年M月d日 h时', x.time),
          likedTip: x.liked > 10000 ? `${Math.round(x.liked / 1000) / 10}万` : x.liked
        }));
        that.setData({
          hot: newHot
        });
        wx.setStorageSync('hot', res.result);
      }).catch(err => {
        console.log(err)
      });
    }
  }
})