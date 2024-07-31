const cloud = require('wx-server-sdk');
const axios = require('axios');
cloud.init();
const db = cloud.database();

const CONFIG = {
  NEW_API_URL: {
    HOT: 'https://www.zhihu.com/api/v4/search/top_search'
  }
};
console.log("CONFIG", CONFIG);

exports.main = async (event, context) => {
  try {
    // 获取数据库集合中的数据
    const interestResult = await db.collection('interest').get();
    const LIST = interestResult.data.map(item => item.interest);
    console.log("LIST", LIST);

    if (LIST.length === 0) {
      return { message: 'No interests found in database' };
    }

    // 从云开发数据库中查询等待发送的消息列表
    const messagesResult = await db.collection('userMsg')
      .where({
        isSend: false,
      })
      .get();
    const messages = messagesResult.data;
    console.log("messages", messages);

    // 获取热搜词
    const res = await axios.get(CONFIG.NEW_API_URL.HOT);
    if (res.status === 200 && res.data.top_search && res.data.top_search.words) {
      const words = res.data.top_search.words;
      const matchingWords = findMatchingWords(words, LIST);
      if (matchingWords.length > 0) {
        const thing1Value = matchingWords[0] || 'default value';
        console.log('thing1Value:', thing1Value);

        const sendPromises = messages.map(async message => {
          try {
            // 发送订阅消息
            await cloud.openapi.subscribeMessage.send({
              touser: message.touser,
              page: message.page || 'pages/index/index',
              data: {
                thing1: {
                  value: thing1Value
                },
                thing5: {
                  value: '你关注的话题更新了'
                }
              },
              miniprogram_state: 'developer',
              templateId: message.templateId || '-X5Un8oFQmB0e_yDW-E-8JI97TyolqSwZPak8I-4-_s'
            });

            // 发送成功后将消息的状态改为已发送
            return db.collection('userMsg')
              .doc(message._id)
              .update({
                data: {
                  isSend: true,
                },
              });
          } catch (e) {
            console.error('发送消息失败', e);
            return e;
          }
        });

        return await Promise.all(sendPromises);
      } else {
        return { message: 'No matching words found' };
      }
    } else {
      return { message: 'Failed to fetch data or data format error' };
    }
  } catch (err) {
    console.error('Error in cloud function:', err);
    return err;
  }
};

function findMatchingWords(words, list) {
  const matches = [];
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < list.length; j++) {
      if (words[i].query.includes(list[j].replace(/"/g, ''))) {
        matches.push(words[i].query);
      }
    }
  }
  return matches;
}
