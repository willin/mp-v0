// 云函数入口文件
const SDK = require('wnm');

const search = keywords => SDK.search({
  keywords,
  type: 1
}).then(({
  body: {
    result: {
      songs = []
    } = {}
  } = {}
}) => songs.map(({
  id,
  name,
  artists: [{ name: artist = '' } = {}] = [],
  album: { name: album = '' } = {}
}) => ({
  id,
  name,
  artist,
  album
})));

// 云函数入口函数
exports.main = async (event, context) => {
  const { keywords } = event;
  const result = await search(keywords);
  return result;
}