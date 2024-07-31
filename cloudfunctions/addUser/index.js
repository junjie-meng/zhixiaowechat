const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  // 向 course-message 集合库中写入相关数据
  try {
    const { OPENID } = cloud.getWXContext();
    const result = await db.collection('userMsg').add({
      data: {
        touser: OPENID, // 订阅者的openid
        isSend: false, // 消息发送状态设置为 false
      },
    });
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
