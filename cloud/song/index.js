const SDK = require('wnm');
// 云函数入口文件
// const cloud = require('wx-server-sdk')
// cloud.init()

const getSongHotComments = id => SDK.comment.hot({
  id,
  type: 0
}).then(({ body: { hotComments } }) => hotComments.filter(({ content, likedCount }) => content.length > 100 || likedCount > 1e5)
  .map(({
    user: { vipRights, avatarUrl, nickname }, time, likedCount, content, commentId
  }) => ({
    sid: id,
    cid: commentId,
    vip: vipRights !== null,
    avatar: avatarUrl,
    liked: likedCount,
    content,
    time,
    nickname
  })));

// 云函数入口函数
exports.main = async (event, context) => {
  const { id } = event;
  const result = await getSongHotComments(id);
  return result;
};
