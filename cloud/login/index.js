// 云函数模板
// 部署：在 cloud/login 文件夹右击选择 “上传并部署”
const SDK = require('wnm');

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含
 * - 小程序端调用传入的 data
 * - 经过微信鉴权直接可信的用户唯一标识 openid 
 * 
 */
exports.main = async (event, context) => {
  const {phone = '', pwd: password = ''} = event;
  let task;
  if(/^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/.test(phone)) {
    // 手机登录
    task = SDK.login.cellphone({
      phone,
      password
    });
  } else {
    // 邮箱登录
    task = SDK.login({
      email: phone,
      password
    });
  }
  const { body: { account: { id: uid = 0 } = {}, profile: { gender = 1 } = { } } = {} } = await task.catch(()=>({}));
  return {
    uid,
    gender
  };
}
