const SDK = require('wnm');
// 云函数入口文件
// const cloud = require('wx-server-sdk')
// cloud.init()

const getUserHotComments = uid => SDK.user.record({
  uid,
  type: '0'
}).then(({
  body: {
    allData: songs =[]
  } = {}
}) => songs.map(({
  song: {
    song: {
      id,
      name: music,
      artist: {
        name: artist
      }
    }
  }
}) => SDK.comment.hot({
  id,
  type: 0
}).then(({ body: { hotComments } }) => hotComments.filter(({ content }) => content.length > 140)
  .map(({
    user: { vipRights, avatarUrl, nickname }, time, likedCount, content, commentId
  }) => ({
    sid: id,
    cid: commentId,
    vip: vipRights !== null,
    avatar: avatarUrl,
    liked: likedCount,
    music,
    artist,
    content,
    time,
    nickname
  })))))
  .then(p => Promise.all(p))
  .then(p => [].concat.call(...p).sort((x, y) => (x.liked - y.liked > 0 ? -1 : 1)));

// 云函数入口函数
exports.main = async (event, context) => {
  const { uid } = event;
  const result = await getUserHotComments(uid);
  return result;
}