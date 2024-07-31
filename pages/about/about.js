const app = getApp();

Page({
  data: {
    userInput: '',
    interests: []
  },
  handleTap: function() {
    if (!this.data.hasSubscribed) {
        this.requestSubscribeMessage();
        this.setData({
            hasSubscribed: true // 更新标志位，确保只触发一次
        });
    }
},

requestSubscribeMessage: function() {
    wx.requestSubscribeMessage({
        tmplIds: ['-X5Un8oFQmB0e_yDW-E-8JI97TyolqSwZPak8I-4-_s'],
        success(res) {
            console.log(res);
            wx.cloud.callFunction({
              name:'addUser',
              complete: res=>{
                console.log('callFunction test result: ', res)
              }
            })
        },
        fail(err) {
            console.error('Failed to request subscription message', err);
        }
    });
},

  onInputChange(e) {
    this.setData({
      userInput: e.detail.value
    });
  },

  onLoad() {
    this.loadInterests();
  },

  onSubmit() {
    wx.requestSubscribeMessage({
      tmplIds: ['-X5Un8oFQmB0e_yDW-E-8JI97TyolqSwZPak8I-4-_s'],
      success(res) {
          console.log(res);
          ;
      },
      fail(err) {
          console.error('Failed to request subscription message', err);
      }
  })

    const db = wx.cloud.database();
    const userInput = this.data.userInput;

    if (userInput) {
      // 调用云函数进行数据库操作
      wx.cloud.callFunction({
        name: 'addInterest',
        data: {
          interest: userInput
        },
        success: res => {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
    
          // 将输入的内容添加到本地数据中
          const newInterests = this.data.interests;
          newInterests.push({ interest: userInput });
    
          this.setData({
            interests: newInterests,
            userInput: ''
          });
        },
        fail: err => {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
          console.error('保存失败', err);
        }
      });
    }
     else {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none'
      });
    }
  },

  loadInterests() {
    const db = wx.cloud.database();
    db.collection('interest').get({
      success: res => {
        this.setData({
          interests: res.data
        });
        console.log("rse data", res.data);
      },
      fail: err => {
        console.error('加载兴趣爱好失败', err);
      }
    });
  }
});
