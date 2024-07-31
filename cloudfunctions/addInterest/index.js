const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    const { OPENID } = cloud.getWXContext();
    const result = await db.collection('interest').add({
      data: {
        touser: OPENID, // 订阅者的openid
        interest: event.interest || 'default value' // 用户输入的兴趣爱好
      }
    });
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
